import './rsvp-section.scss';
import * as React from 'react';
import cx from 'classnames';
import { IAttendee } from '../../../server/types/models';
import Cow from '../icons/Cow';
import Fish from '../icons/Fish';
import Vegetarian from '../icons/Vegetarian';

interface Props {
	attendees: IAttendee[];
	selectedEvents: {
		[attendeeId: string]: {
			[eventId: string]: boolean;
		};
	};
	isAnUpdate: boolean;
	onSubmit: () => any;
	onSelectEvent: (attendeeId: string, eventId: string, value: boolean) => any;
}

const ReceptionCardContent = ({attendee, selectEvent, selectedEvents}) => {
	return (
		<div className="attendance">
			<p><small>Please tap to select/unselect an event</small></p>
			<div>
				{attendee.Events.map(eventService => {
					const isSelected = selectedEvents[eventService.id];
					return (
						<div
							key={eventService.id}
							className={cx('checkbox-group', {active: isSelected})}
							onClick={() => selectEvent(attendee.id, eventService.id, !isSelected)}
						>
							<i className="custom-checkbox material-icons">check</i>
							<label className="form-check-label">
								{eventService.name}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const WeddingBreakfastCardContent = (props) => {
	return (
		<div className="dietry-requirements">
			<p>Please choose your preferred dietry requirements</p>
			<div className="non-vegetarian">
				<div className="starters">
					<header>Starters</header>
					<small>Choose an option for your starter</small>
					<div className="options">
						<div className="meat active">
							<figure>
								<Cow />
							</figure>
							<header>Meat</header>
						</div>
						<div className="fish">
							<figure>
								<Fish />
							</figure>
							<header>Fish</header>
						</div>
					</div>
				</div>
				<div className="main-courses">
					<header>Main Course</header>
					<small>Choose an option for your mains</small>
					<div className="options">
						<div className="meat active">
							<figure>
								<Cow />
							</figure>
							<header>Meat</header>
						</div>
						<div className="fish">
							<figure>
								<Fish />
							</figure>
							<header>Fish</header>
						</div>
					</div>
				</div>
			</div>
			<div className="vegetarian">
				<hr />
				<h3>OR</h3>
				<small>Optionally, vegetarian meals are available for those who require them. Select vegetarian below if your dietry requirements suggest so.</small>
				<div className="vegetarian-icon">
					<figure>
						<Vegetarian />
					</figure>
					<header>Vegetarian</header>
				</div>
			</div>
		</div>
	);
};

export default class RsvpSection extends React.Component<Props> {
	render() {
		return (
			<div className="section section-rsvp">
				<h2 className="section-title"><span>Please reply</span> Répondez s'il vous plaît</h2>
				<p>Please send your response by<br/><strong>May 31st</strong><br/>Responses after this date has passed will not be counted and your place will not be guaranteed.</p>
				<p>Tap on an event to select/unselect it and indicate your attendance.</p>
				<div className="row rsvps">
					{this.props.attendees.map(attendee => {
						return (
							<div key={attendee.id} className="rsvp full-card">
								<header>{attendee.firstName} {attendee.lastName}</header>
								<div className="content">
									<ReceptionCardContent
										attendee={attendee}
										selectedEvents={this.props.selectedEvents[attendee.id]}
										selectEvent={this.props.onSelectEvent}
									/>
									<WeddingBreakfastCardContent />
								</div>
							</div>
						);
					})}
				</div>
				<button className="btn btn-lg" onClick={this.props.onSubmit}>
					{this.props.isAnUpdate ?  'Update' : 'Send'} Response
				</button>
			</div>
		);
	}
}
