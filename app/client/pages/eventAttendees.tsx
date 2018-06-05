import * as React from 'react';
import AttendeeSearch from '../components/AttendeeSearch';
import { searchForAttendee } from '../api/attendee';
import { getEventAttendees, setEventAttendees, addEventAttendee } from '../api/event';
import withModal from '../components/withModal';
import { withAdmin } from '../components/adminLayout';
import cx from 'classnames';
import Attendee from '../../server/models/attendee';
import EventModel from '../../server/models/event';
import CheckboxTable from '../components/CheckboxTable';

interface IEventAttendeesPage {
	event: EventModel;
	attendees: Attendee[];
	refreshAttendees: () => Promise<any>;
}

interface State {
	guests: EventModel['Guests'];
	filter: 'confirmed' | 'attending' | 'notAttending' | 'food' | null
	attendees: Attendee[];
	selectedAttendees: {
		[id: string]: Attendee;
	};
}

class EventAttendeesContainer extends React.Component<{event: EventModel}> {
	static getInitialProps = async ({ res, query }) => {
		const event = (!res && query && query.eventId ?
			await getEventAttendees(query.eventId) :
			res.locals.event
		);

		return { event };
	}

	state = {
		guests: [],
	};

	componentWillMount() {
		this.setState({ guests: this.props.event.Guests });
	}

	refreshGuestlist = () => {
		return getEventAttendees(this.props.url.query.eventId).then(event => {
			this.setState({ guests: event.Guests });
		});
	}

	render() {
		return (
			<EventAttendeesPage
				event={this.props.event}
				attendees={this.state.guests}
				refreshAttendees={this.refreshGuestlist}
			/>
		);
	}
}

class EventAttendeesPage extends React.Component<IEventAttendeesPage, State> {
	state: State  = {
		guests: [],
		filter: null,
		attendees: [],
		selectedAttendees: {},
	};

	download: HTMLAnchorElement;

	componentDidMount() {
		this.setFilterDisplay();
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

	addAttendee = async (attendee) => {
		await addEventAttendee(this.props.event.id, attendee.id);
		await this.props.refreshAttendees();
	}

	removeAttendees = (attendeeIds: string[]) => {
		const attendeesStillInvitedToEvent = this.props.attendees.reduce((guests, attendee) => {
			return attendeeIds.indexOf(attendee.id) >= 0 ? guests : [...guests, attendee.id];
		}, [] as string[]);

		setEventAttendees(this.props.event.id, attendeesStillInvitedToEvent)
			.then(() => this.props.refreshAttendees())
			.catch(() => alert('Ooops, something went wrong, try again later'));
	}

	renderHeader = () => {
		return (
			<tr>
				<th>Name</th>
				<th>Email</th>
				{this.state.filter === 'food' ?
					(
						<React.Fragment>
							<th>Starter</th>
							<th>Main</th>
						</React.Fragment>
					) :
					(
						<React.Fragment>
							<th>Attending</th>
							<th>RSVP confirmed</th>
						</React.Fragment>
					)
				}
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow = (guest, onCheckboxTick, itemIsChecked) => {
		const food = guest.FoodChoice;
		return (
			<tr key={guest.id}>
				<td>{guest.firstName} {guest.lastName}</td>
				<td>{guest.email}</td>
				{this.state.filter === 'food' ?
					(
						<React.Fragment>
							<td>{food && food.starter || '-'}</td>
							<td>{food && food.main || '-'}</td>
						</React.Fragment>
					) :
					(
						<React.Fragment>
							<td>{guest.EventAttendee.attending.toString()}</td>
							<td>{guest.EventAttendee.confirmed.toString()}</td>
						</React.Fragment>
					)
				}
				<td>
					<input
						type="checkbox"
						className="uk-checkbox"
						checked={itemIsChecked}
						onChange={(e) => onCheckboxTick(e)}
					/>
				</td>
			</tr>
		);
	}

	setFilterDisplay(filter?: 'confirmed' | 'attending' | 'notAttending' | 'food' | null) {
		this.setState({ filter });
		this.setState({ guests: this.filterListing(filter) });
	}

	filterListing(filter?: 'confirmed' | 'attending' | 'notAttending' | 'food') {
		switch (filter) {
			case 'confirmed':
				return this.props.attendees.filter(attendee => attendee.EventAttendee.confirmed);
			case 'food':
			case 'attending':
				return this.props.attendees.filter(attendee => attendee.EventAttendee.confirmed && attendee.EventAttendee.attending);
			case 'notAttending':
				return this.props.attendees.filter(attendee => attendee.EventAttendee.confirmed && !attendee.EventAttendee.attending);
			default:
				return this.props.attendees;
		}
	}

	downloadCurrentListView() {
		const rows = this.state.guests.map(guest => {
			const row = [
				guest.firstName + '' + guest.lastName,
				guest.EventAttendee.attending,
				guest.FoodChoice && guest.FoodChoice.starter || '-',
				guest.FoodChoice && guest.FoodChoice.main || '-',
			];
			return row.join(',');
		});
		const csvContent = encodeURI("data:text/csv;charset=utf-8," + rows.map(row => row + "\r\n").join(''));
		this.setState({ csvContent });
	}

	filterButtons() {
		return (
			<React.Fragment>
				<button
					onClick={() => this.setFilterDisplay(this.state.filter === 'confirmed' ? null : 'confirmed')}
					className={cx("uk-margin-small-right uk-button uk-button-small", {
						'uk-button-secondary': !!this.state.filter,
					})}
				>
					Confirmed
				</button>
				<button
					onClick={() => this.setFilterDisplay(this.state.filter === 'attending' ? null : 'attending')}
					className={cx("uk-margin-small-right uk-button uk-button-small", {
						'uk-button-secondary': this.state.filter === 'attending',
					})}
				>
					Attending
				</button>
				<button
					onClick={() => this.setFilterDisplay(this.state.filter === 'notAttending' ? null : 'notAttending')}
					className={cx("uk-margin-small-right uk-button uk-button-small", {
						'uk-button-secondary': this.state.filter === 'notAttending',
					})}
				>
					Not attending
				</button>
				{this.props.event.dietFeedback &&
					<button
						onClick={() => this.setFilterDisplay(this.state.filter === 'food' ? null : 'food')}
						className={cx("uk-margin-small-right uk-button uk-button-small", {
							'uk-button-secondary': this.state.filter === 'food',
						})}
					>
						Foods
					</button>
				}
			</React.Fragment>
		);
	}

	downloadCSV() {
		let csvHeader = 'name,email,attending';
		csvHeader = csvHeader + (this.props.event.dietFeedback ? ',starter,main,allergies' : '');
		csvHeader = csvHeader + '\r\n';

		const rows = this.state.guests.map(guest => {
			const foodChoice = this.props.event.dietFeedback ?
				(!!guest.FoodChoice ?
					`${guest.FoodChoice.starter},${guest.FoodChoice.main},${guest.FoodChoice.allergies},` :
					''
				) :
				'';

			return (
				`${(guest.firstName + ' ' + guest.lastName).trim()},` +
				`${guest.email},` +
				`${guest.EventAttendee.attending},` +
				foodChoice
			);
		});

		const data = rows.join('\r\n') + '\r\n';
		const csvContent = 'data:text/csv;charset=utf-8,' + csvHeader + data;
		this.download.setAttribute('href', csvContent);
		this.download.setAttribute(
			'download',
			this.props.event.name.toLowerCase().split(' ').join('_') + '_guests.csv',
		);
		this.download.click();
	}

	render() {
		return (
			<div>
				<h1 className="uk-container">{this.props.event.name}</h1>
				<div className="uk-section uk-section-xsmall uk-container">
					<h3>Add Attendee</h3>
					<p>Search for an attendee, to add them to this event</p>
					<AttendeeSearch
						data={this.state.attendees}
						onClick={this.addAttendee}
						onChange={this.attendeeSearch}
					/>
				</div>
				<div className="uk-section uk-section-xsmall uk-container uk-text-right">
					<button
						onClick={() => this.downloadCSV()}
						className="uk-button uk-button-primary"
					>
						Download guest list
					</button>
					<a ref={ref => this.download = ref} style={{ display: 'none' }} />
				</div>
				<div className="uk-section uk-section-xsmall uk-container">
					<CheckboxTable
						buttons={this.filterButtons()}
						data={this.state.guests}
						renderHeaderRow={this.renderHeader}
						renderRow={this.renderRow}
						onDelete={this.removeAttendees}
					/>
				</div>
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Events' }, EventAttendeesContainer),
);
