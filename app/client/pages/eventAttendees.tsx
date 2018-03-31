import * as React from 'react';
import Router from 'next/router';
import AttendeeSearch from '../components/AttendeeSearch';
import { searchForAttendee } from '../api/attendee';
import { getEventAttendees, setEventAttendees } from '../api/event';
import withModal from '../components/withModal';
import { withAdmin } from '../components/adminLayout';
import { IEvent } from '../../server/types/models';
import FilterList from '../components/FilterList';

class EventAttendeesPage extends React.Component<{event: IEvent}> {
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

	onSave = () => {
		setEventAttendees(this.props.event.id, Object.keys(this.state.selectedAttendees))
			.then(() => Router.push('/admin/events'));
	}

	render() {
		const { selectedAttendees } = this.state;
		return (
			<div>
				<h1 className="uk-container">{this.props.event.name}</h1>
				<div className="uk-section uk-section-xsmall uk-container">
					<h3>Add Attendee</h3>
					<p>Search for an attendee, to add them to this event</p>
					<AttendeeSearch
						data={this.state.attendees}
						onClick={this.selectAttendee}
						onChange={this.attendeeSearch}
					/>
				</div>
				{!!Object.keys(selectedAttendees).length &&
					<div className="uk-section uk-section-muted uk-section-xsmall">
						<div className="uk-container">
							<h3>Guests</h3>
							<FilterList
								data={selectedAttendees}
								headerFields={['firstName', 'lastName']}
								bodyFields={['email']}
								onRemove={this.removeAttendee}
							/>
						</div>
					</div>
				}
				<div className="uk-clearfix uk-margin uk-container">
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
