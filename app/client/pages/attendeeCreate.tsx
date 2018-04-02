import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import '../styles/admin.scss';
import { createAttendees } from '../api/attendee';
import { getEvents } from '../api/event';
import Router from 'next/router';
import attendees from './attendees';

const blankAttendee = {
	firstName: '',
	lastName: '',
	email: '',
	events: {},
};

class NewAttendee extends React.Component {
	static getInitialProps = async ({ req, res }) => {
		const events = await getEvents();
		return {
			events,
		};
	}

	state = {
		newAttendees: [
			{ ...blankAttendee },
		],
	};

	updateAttendeeField({ target }, idx, keyName) {
		const attendees = [...this.state.newAttendees];
		attendees[idx][keyName] = target.value;
		this.setState({ newAttendees: attendees });
	}

	addAttendeeField() {
		this.setState({
			newAttendees: [
				...this.state.newAttendees,
				{ ...blankAttendee },
			],
		});
	}

	deleteAttendee(idx) {
		const attendees = [...this.state.newAttendees];
		attendees.splice(idx, 1);
		this.setState({ newAttendees: attendees });
	}

	submit() {
		const newAttendees = this.state.newAttendees.map(attendee => {
			const selectedEventIds = Object.keys(attendee.events).reduce((accum, eventId) => {
				return (attendee.events[eventId] ? [...accum, eventId] : accum);
			}, []);
			return {
				...attendee,
				eventIds: selectedEventIds,
			};
		});

		createAttendees(this.state.newAttendees).then(() => {
			Router.push('/admin/attendees');
		});
	}

	onSelectEvent(e, idx) {
		const attendees = [...this.state.newAttendees];
		attendees[idx].events[e.target.value] = e.target.checked;
		this.setState({ newAttendees: attendees });
	}

	render() {
		return (
			<div className="uk-container">
				<form>
					{this.state.newAttendees.map((attendee, idx) => {
						const { firstName, lastName, email} = attendee;
						return (
							<div
								key={`new-attendee-${idx}`}
								className="uk-tile uk-tile-muted uk-padding-small uk-margin"
							>
								<div className="uk-clearfix uk-margin">
									<i
										onClick={() => this.deleteAttendee(idx)}
										className="uk-float-right material-icons"
									>
										delete
									</i>
								</div>
								<div className="uk-grid uk-grid-small">
									<div className="uk-width-2-3@s">
										<div className="uk-margin">
											<input
												type="text"
												value={firstName}
												onChange={e => this.updateAttendeeField(e, idx, 'firstName')}
												className="uk-input"
												placeholder="First name"
											/>
										</div>
										<div className="uk-margin">
											<input
												type="text"
												value={lastName}
												onChange={e => this.updateAttendeeField(e, idx, 'lastName')}
												className="uk-input"
												placeholder="Last name"
											/>
										</div>
										<div className="uk-margin">
											<input
												type="email"
												value={email}
												onChange={e => this.updateAttendeeField(e, idx, 'email')}
												className="uk-input"
												placeholder="Enter email"
											/>
										</div>
									</div>
									<div className="uk-width-1-3@s uk-margin">
										{this.props.events && this.props.events.map(event => (
											<div key={event.id} className="uk-margin">
												<label>
													<input
														className="uk-checkbox"
														type="checkbox"
														value={event.id}
														checked={this.state.newAttendees[idx][event.id]}
														onChange={e => this.onSelectEvent(e, idx)}
													/>
													&nbsp;{event.name}
												</label>
											</div>
										))}
									</div>
								</div>
							</div>
						);
					})}
					<div
						onClick={() => this.addAttendeeField()}
						className="uk-button uk-button-secondary"
					>
						Add More
					</div>
					<div className="uk-clearfix">
						<div
							onClick={() => this.submit()}
							className="uk-button uk-button-primary uk-float-right"
						>
							Submit
						</div>
						<div
							onClick={() => Router.push('/admin/attendees')}
							className="uk-button uk-button-default uk-margin-right uk-float-right"
						>
							Cancel
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withAdmin({ title: 'Attendees' }, NewAttendee);
