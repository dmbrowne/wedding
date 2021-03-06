import * as React from 'react';
import AttendeeSearch from '../AttendeeSearch';
import '../../styles/admin.scss';
import Attendee from '../../../server/models/attendee';
import SelectedAttendees from './SelectedAttendees';
import AutoCompleteSearch from '../AutoCompleteSearch';

interface Props {
	email: string;
	groupName: string;
	attendeesSearchResults: Attendee[];
	selectedAttendees: { [key: string]: Attendee };
	onSearch: (e: React.MouseEvent<HTMLElement>) => any;
	onChange: (e, keyName: 'email' | 'groupName') => any;
	removeAttendee: (attendeeIds: Array<Attendee['id']>) => any;
	onSelectAttendee: (attendeeIds: Array<Attendee['id']>) => any;
	onOrderChange: (attendeeId: string, order: number) => any;
}

interface State {
	emailList: string[];
}

export default class AttendeeGroupForm extends React.Component<Props, State> {
	constructor(props) {
		super(props);

		const { selectedAttendees } = props;
		const emailList = Object.keys(selectedAttendees)
			.map(attendeeId => selectedAttendees[attendeeId].email)
			.filter(attendeeEmail => attendeeEmail);

		this.state = { emailList };
	}

	searchEmailList = (e) => {
		const {value} = e.target;
		const { selectedAttendees } = this.props;
		this.props.onChange(e, 'email');

		const allEmails = Object.keys(selectedAttendees).map(attendeeId => selectedAttendees[attendeeId].email);
		const emailList = (!value.length ?
			allEmails.filter(attendeeEmail => attendeeEmail) :
			allEmails.filter(email => email && email.indexOf(value) >= 0)
		);

		this.setState({ emailList });
	}

	renderEmailSelectRow = (email) => {
		return (
			<li
				key={email}
				className="list-group-item"
				onClick={() => this.props.onChange({ target: { value: email }}, 'email')}
			>
				{email}
			</li>
		);
	}

	render() {
		const emailSuggestions = Object.keys(this.props.selectedAttendees).reduce((accum, attendeeId) => {
			if (!!this.props.selectedAttendees[attendeeId].email) {
				return [...accum, this.props.selectedAttendees[attendeeId].email];
			}
			return accum;
		}, []);
		return (
			<React.Fragment>
				<section className="uk-section uk-padding uk-section-default">
					<div className="uk-container">
						<h3 className="uk-margin">Group details</h3>
						<form className="uk-margin-top">
							<div className="uk-margin">
								<label>Group name</label>
								<input
									className="uk-input"
									type="text"
									value={this.props.groupName}
									onChange={e => this.props.onChange(e, 'groupName')}
								/>
							</div>
							<div className="uk-margin">
								<label>Add members</label>
								<AttendeeSearch
									onChange={this.props.onSearch}
									onClick={this.props.onSelectAttendee}
									data={this.props.attendeesSearchResults}
								/>
							</div>
						</form>
					</div>
				</section>
				<section className="uk-section-muted uk-padding">
					<div className="uk-container">
						<h3 className="uk-margin">Selected Attendees</h3>
						{Object.keys(this.props.selectedAttendees).length > 0 &&
							<SelectedAttendees
								attendeesMap={this.props.selectedAttendees}
								onClick={this.props.removeAttendee}
								onOrderChange={this.props.onOrderChange}
							/>
						}
					</div>
				</section>
				<section className="uk-section uk-padding uk-section-default">
					<div className="uk-container uk-margin">
						<h3 className="uk-margin">Correspondence email</h3>
						{emailSuggestions.length > 0 && (
							<div className="uk-margin">
								<header>Suggestions</header>
								{emailSuggestions.map(email => (
									<button
										onClick={e => this.props.onChange({target: {value: email }}, 'email')}
										className="uk-button uk-button-secondary width-1-1"
									>
										{email}
									</button>
								))}
							</div>
						)}
						<input
							placeholder="Email to be used for correspondence"
							className="uk-input"
							type="search"
							onChange={e => this.props.onChange(e, 'email')}
							value={this.props.email}
						/>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
