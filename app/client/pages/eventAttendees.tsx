import * as React from 'react';
import AttendeeSearch from '../components/AttendeeSearch';
import { searchForAttendee } from '../api/attendee';
import { getEventAttendees, setEventAttendees } from '../api/event';
import withModal from '../components/withModal';
import { withAdmin } from '../components/adminLayout';

class EventAttendeesPage extends React.Component {
	static getInitialProps = async ({ res, query }) => {
		const event = (!res && query && query.eventId ?
			await getEventAttendees(query.eventId) :
			res.locals.event
		);

		return { event };
	}

	state = {
		attendees: [],
		selectedAttendees: {},
		filterSearchTerms: '',
	};

	componentWillMount() {
		if (Array.isArray(this.props.event.Guests)) {
			const selectedAttendees = this.props.event.Guests.reduce((accum, attendee) => ({
				...accum,
				[attendee.id]: attendee,
			}), {});
			this.setState({ selectedAttendees });
		}
	}

	attendeeSearch = (e) => {
		const searchValue = e.target.value;
		if (searchValue.length > 2) {
			return searchForAttendee(searchValue).then(attendees => {
				this.setState({ attendees });
			});
		}
		return this.setState({ attendees: [] });
	}

	selectAttendee = (attendee) => {
		this.setState({
			selectedAttendees: {
				...this.state.selectedAttendees,
				[attendee.id]: attendee,
			},
		});
	}

	removeAttendee = (attendeeId) => {
		const newSelectedAttendees = { ...this.state.selectedAttendees };
		delete newSelectedAttendees[attendeeId];
		this.setState({ selectedAttendees: newSelectedAttendees });
	}

	filteredGuestIds() {
		return Object.keys(this.state.selectedAttendees).filter(attendeeId => {
			const attendee = this.state.selectedAttendees[attendeeId];
			const searchField = [
				attendee.firstName, attendee.lastName, attendee.email,
			].join(' ');
			return this.state.filterSearchTerms ? searchField.indexOf(this.state.filterSearchTerms) >= 0 : true;
		});
	}

	onSave() {
		setEventAttendees(this.props.event.id, Object.keys(this.state.selectedAttendees));
	}

	render() {
		const { selectedAttendees } = this.state;
		const guests = this.filteredGuestIds();
		return (
			<div>
				<h1>{this.props.event.name}</h1>
				<div className="uk-section uk-section-xsmall">
					<h3>Add Attendee</h3>
					<p>Search for an attendee, to add them to this event</p>
					<AttendeeSearch
						data={this.state.attendees}
						onClick={this.selectAttendee}
						onChange={this.attendeeSearch}
					/>
				</div>
				{!!guests.length &&
					<div className="uk-section uk-section-muted uk-section-xsmall">
						<h3>Guests</h3>
						<input
							type="search"
							className="uk-input"
							value={this.state.filterSearchTerms}
							onChange={e => this.setState({ filterSearchTerms: e.target.value })}
							placeholder="filter attendees"
						/>
						<dl className="uk-description-list uk-description-list-divider uk-margin">
							{guests.map(attendeeId => {
								const attendee = selectedAttendees[attendeeId];
								return (
									<React.Fragment key={attendeeId}>
										<dt className="uk-flex uk-flex-middle uk-flex-between">
											<div>{attendee.firstName} {attendee.lastName}</div>
											<i
												className="material-icons"
												onClick={() => this.removeAttendee(attendeeId)}
											>
												delete
											</i>
										</dt>
										<dd>{attendee.email || '-'}</dd>
									</React.Fragment>
								);
							})}
						</dl>
					</div>
				}
				<div className="uk-clearfix uk-margin">
					<button
						className="uk-button uk-button-primary uk-float-right"
						onClick={this.onSave}
					>
						Save
					</button>
				</div>
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Events' }, EventAttendeesPage),
);
