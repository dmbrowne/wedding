import './rsvp-section.scss';
import * as React from 'react';
import cx from 'classnames';
import Attendee from '../../../server/models/attendee';
import Cow from '../icons/Cow';
import Fish from '../icons/Fish';
import FoodChoice from '../../../server/models/foodChoice';

interface AttendeeWithDietOptions extends Attendee {
	dietFeedbackRequired?: boolean;
}

interface Props {
	attendees: AttendeeWithDietOptions[];
	selectedEvents: {
		[attendeeId: string]: {
			[eventId: string]: boolean;
		};
	};
	isAnUpdate: boolean;
	foodSelections: {
		[attendeeId: string]: Pick<FoodChoice, 'starter' | 'main'>,
	};
	onSubmit: () => any;
	onSelectEvent: (attendeeId: string, eventId: string, value: boolean) => any;
	onSelectStarter?: (attendeeId: string, choice: 'meat' | 'fish' | 'vegetarian') => Promise<any>;
	onSelectMains?: (attendeeId: string, choice: 'meat' | 'fish' | 'vegetarian') => Promise<any>;
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
							className={cx('checkbox-group', {selected: isSelected})}
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

interface WeddingBreakfastCardContentProps {
	selected: Pick<FoodChoice, 'starter' | 'main'>;
	starterSelect: (choice: 'meat' | 'fish' | 'vegetarian') => any;
	mainSelect: (choice: 'meat' | 'fish' | 'vegetarian') => any;
}

export const WeddingBreakfastCardContent = ({ selected, starterSelect, mainSelect }: WeddingBreakfastCardContentProps) => {
	return (
		<div className="dietry-requirements">
			<header>Choose your food options:</header>
			<div className="dietry-requirements-preferences">
				<div className="starters course">
					<header>Starter</header>
					<div className="course-options">
						<div
							onClick={() => starterSelect('meat')}
							className={cx(
								'course-options-option',
								'checkbox-group', {
									selected: selected && selected.starter === 'meat',
								},
							)}
						>
							<figure>
								<Cow />
							</figure>
							<p>Meat</p>
						</div>
						<div
							onClick={() => starterSelect('fish')}
							className={cx(
								'course-options-option',
								'checkbox-group', {
									selected: selected && selected.starter === 'fish',
								},
							)}
						>
							<figure >
								<Fish />
							</figure>
							<p>Fish</p>
						</div>
					</div>
				</div>
				<div className="main-courses course">
					<header>Main Course</header>
					<div className="course-options">
						<div
							onClick={() => mainSelect('meat')}
							className={cx('course-options-option', 'checkbox-group', { selected: selected && selected.main === 'meat' })}
						>
							<figure>
								<Cow />
							</figure>
							<p>Meat</p>
						</div>
						<div
							onClick={() => mainSelect('fish')}
							className={cx('course-options-option', 'checkbox-group', { selected: selected && selected.main === 'fish' })}
						>
							<figure>
								<Fish />
							</figure>
							<p>Fish</p>
						</div>
					</div>
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
					{this.props.attendees.map(attendee =>  (
						<div key={attendee.id} className={cx('rsvp')}>
							<header>{attendee.firstName} {attendee.lastName}</header>
							<div className="content">
								<ReceptionCardContent
									attendee={attendee}
									selectedEvents={this.props.selectedEvents[attendee.id]}
									selectEvent={this.props.onSelectEvent}
								/>
							</div>
						</div>
						))}
				</div>
				<div className="row dietry-feedback">
					{this.props.attendees.map(attendee => {
						const { dietFeedbackRequired } = attendee;
						return (
							dietFeedbackRequired ?
								<div key={attendee.id} className={cx('rsvp')}>
									<header>{attendee.firstName} {attendee.lastName}</header>
									{dietFeedbackRequired &&
										<WeddingBreakfastCardContent
											selected={this.props.foodSelections[attendee.id]}
											starterSelect={(choice) => this.props.onSelectStarter(attendee.id, choice)}
											mainSelect={(choice) => this.props.onSelectMains(attendee.id, choice)}
										/>
									}
								</div> :
								null
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
