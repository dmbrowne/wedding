import React from 'react';
import AttendeeSearch from '../AttendeeSearch';
import '../../styles/admin.scss';
import { IAttendee } from '../../../server/types/models';
import SelectedAttendees from './SelectedAttendees';
import AutoCompleteSearch from '../AutoCompleteSearch';

interface Props {
	email: string;
	groupName: string;
	attendeesSearchResults: IAttendee[];
	selectedAttendees: { [key: string]: IAttendee };
	onSearch: (e: React.MouseEvent<HTMLElement>) => any;
	onChange: (e, keyName: 'email' | 'groupName') => any;
	removeAttendee: (attendeeIds: Array<IAttendee['id']>) => any;
	onSelectAttendee: (attendeeIds: Array<IAttendee['id']>) => any;
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
		return (
			<React.Fragment>
				<section className="uk-section uk-padding uk-section-default">
					<h3 className="uk-margin">Group details</h3>
					<form className="uk-margin-top">
						<div className="form-group">
							<label>Group name</label>
							<input
								className="form-control"
								type="text"
								value={this.props.groupName}
								onChange={e => this.props.onChange(e, 'groupName')}
							/>
						</div>
						<div className="form-group">
							<label>Add members</label>
							<AttendeeSearch
								onChange={this.props.onSearch}
								onClick={this.props.onSelectAttendee}
								data={this.props.attendeesSearchResults}
							/>
						</div>
					</form>
				</section>
				<section className="uk-section-muted uk-padding">
					<h3 className="uk-margin">Selected Attendees</h3>
					{Object.keys(this.props.selectedAttendees).length > 0 &&
						<SelectedAttendees
							attendeesMap={this.props.selectedAttendees}
							onClick={this.props.removeAttendee}
						/>
					}
				</section>
				<section className="uk-section uk-padding uk-section-default">
					<div className="form-group">
						<label>Email for group</label>
						<AutoCompleteSearch
							placeholder="Filter for an email or type in a custom one..."
							value={this.props.email}
							onChange={this.searchEmailList}
							data={this.state.emailList}
							renderRow={this.renderEmailSelectRow}
						/>
					</div>
				</section>
			</React.Fragment>
		);
	}
}