import * as React from 'react';
import Switch from 'react-toggle-switch';
import Link from 'next/link';
import cx from 'classnames';
import { withAdmin } from '../components/adminLayout';
import { editAttendee, deleteAttendees, updateEventAttendance } from '../api/attendee';
import '../styles/admin.scss';
import Router from 'next/router';
import withModal, { ChildProps as WithModalProps } from '../components/withModal';
import Modal from '../components/Modal';
import Attendee from '../../server/models/attendee';
import EventModel from '../../server/models/event';
import "react-toggle-switch/dist/css/switch.min.css";

interface State {
	firstName: string;
	lastName: string;
	email: string;
	events: {
		[eventId: string]: EventModel;
	};
	addEventsModal: boolean;
}

interface Props extends WithModalProps {
	attendee: Attendee;
	allEvents: EventModel[];
}

class AttendeeEdit extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => ({
		attendee: (res ?
			res.locals.attendee :
			null
		),
		allEvents: (res ?
			res.locals.allEvents :
			null
		),
	})

	constructor(props) {
		super(props);
		if (props.attendee) {
			const { firstName, lastName, email, Events } = props.attendee;
			this.state = {
				firstName,
				lastName,
				email,
				events: Events.reduce((accum, event) => ({ ...accum, [event.id]: event }), {}),
				addEventsModal: false,
			};
		}
	}

	onChange({value}, key) {
		this.setState({ [key]: value });
	}

	submit = () => {
		const eventIds = Object.keys(this.state.events);
		const attendance = Object.keys(this.state.events).reduce((accum, eventId) => {
			const eventModel = this.state.events[eventId];
			return {
				...accum,
				[eventModel.id]: eventModel.EventAttendee.attending,
			};
		}, {});

		const body = {...this.state, eventIds };
		delete body.events;
		editAttendee(this.props.attendee.id, body)
			.then(() => updateEventAttendance(this.props.attendee.id, attendance))
			.then(() => Router.push('/admin/attendees'))
			.catch(() => {
				alert('Ooops, something went wrong :( \n Try again later');
			});
	}

	confirmDelete = () => {
		this.props.showConfirmModal({
			title: 'Are you sure',
			body: 'This operation is irreversable and cannot be undone. Are you sure you would like to delete this attendee?',
		})
		.then(
			() => deleteAttendees([this.props.attendee.id]).then(() => Router.push('/admin/attendees')),
			() => void 0,
		)
		.catch(e => {
			alert('Ooops, something went wrong :( \n Try again later');
		});
	}

	removeEvent = (eventId) => {
		const events = { ...this.state.events };
		delete events[eventId];
		this.setState({
			events,
		});
	}

	addEvent = (eventId) => {
		this.setState({
			events: {
				...this.state.events,
				[eventId]: this.props.allEvents.filter(event => event.id === eventId)[0],
			},
		});
	}

	renderEventListRow = (event) => {
		const addOrRemoveEventInvitation = (!!this.state.events[event.id] ?
			this.removeEvent :
			this.addEvent
		);
		return (
			<li
				key={event.id}
				className="uk-clearfix"
				onClick={() => addOrRemoveEventInvitation(event.id)}
			>
				<span>{event.name}</span>
				{!!this.state.events[event.id] && (
					<i className="material-icons uk-float-right">check</i>
				)}
			</li>
		);
	}

	toggleEventAttendance(eventModel) {
		this.setState({
			events: {
				...this.state.events,
				[eventModel.id]: {
					...eventModel,
					EventAttendee: {
						...eventModel.EventAttendee,
						attending: !eventModel.EventAttendee.attending,
					},
				},
			},
		});
	}

	render() {
		return (
			<div>
				<div className="uk-section uk-section-small">
					<div className="uk-container">
						<h2>Details</h2>
						<div className="uk-margin">
							<label>First name</label>
							<input
								type="text"
								value={this.state.firstName}
								onChange={({target}) => this.onChange(target, 'firstName')}
								className="uk-input"
								placeholder="First name"
							/>
						</div>
						<div className="uk-margin">
							<label>Last name</label>
							<input
								type="text"
								value={this.state.lastName}
								onChange={({target}) => this.onChange(target, 'lastName')}
								className="uk-input"
								placeholder="Last name"
							/>
						</div>
						<div className="uk-margin">
							<label>Email</label>
							<input
								type="email"
								value={this.state.email}
								onChange={({target}) => this.onChange(target, 'email')}
								className="uk-input"
								placeholder="Last name"
							/>
						</div>
					</div>
				</div>
				<div className="uk-section uk-section-small uk-section-muted">
					<div className="uk-container">
						<h2>Events & services</h2>
						<div className="uk-grid">
							{!this.state.events || Object.keys(this.state.events).length === 0 ?
								<p>This attendee is apart of any events</p> :
								Object.keys(this.state.events).map(eventId => {
									const event = this.state.events[eventId];
									return (
										<div key={event.id} className="uk-width-1-3@s uk-width-1-4@m">
											<div className="uk-card uk-card-small uk-card-default uk-card-body">
												<div className="uk-card-title" style={{fontSize: '1.1rem'}}>{event.name}</div>
												<div className="uk-margin-small">
													<small
														style={{ padding: '3px 10px', display: 'inline-block', borderRadius: 15 }}
														className={cx({
															'uk-alert-primary': !event.EventAttendee.confirmed,
															'uk-alert-success': event.EventAttendee.confirmed,
														})}
													>
														{event.EventAttendee.confirmed ? 'Responded' : 'Not responded'}
													</small>
												</div>
												<Switch
													onClick={() => this.toggleEventAttendance(event)}
													on={event.EventAttendee.attending}
												/>
												<i
													className="material-icons uk-float-right"
													onClick={() => this.removeEvent(event.id)}
												>
													delete
												</i>
											</div>
										</div>
									);
								})
							}
						</div>
						<button
							onClick={() => this.setState({ addEventsModal: true })}
							className="uk-margin uk-button uk-button-small uk-button-secondary"
						>
							Add events
						</button>
					</div>
				</div>
				<div className="uk-section uk-section-small uk-container">
					<div className="uk-clearfix">
						<div className="uk-float-right">
							<Link href="attendees" as="/admin/attendees">
								<div className="uk-button uk-button-default">Cancel</div>
							</Link>
							<div onClick={this.submit} className="uk-margin-left uk-button uk-button-primary">Save</div>
						</div>
					</div>
					<div className="uk-padding-small uk-clearfix uk-margin">
						<div className="uk-float-right">
							<div onClick={this.confirmDelete} className="uk-float-right uk-button uk-text-danger uk-button-text">Delete</div>
						</div>
					</div>
				</div>
				{!!this.state.addEventsModal && (
					<Modal
						title={`add events for ${this.props.attendee.firstName}`}
						footer={(
							<footer className="uk-modal-footer uk-text-right">
								<button
									onClick={() => this.setState({ addEventsModal: false })}
									className="uk-button uk-button-secondary"
								>
									Close
								</button>
							</footer>
						)}
					>
						<ul className="uk-list uk-list-divider">
							{this.props.allEvents.map(event => this.renderEventListRow(event))}
						</ul>
					</Modal>
				)}
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Attendees' }, AttendeeEdit),
);
