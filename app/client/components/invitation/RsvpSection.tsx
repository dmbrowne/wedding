import './rsvp-section.scss';
import * as React from 'react';
import cx from 'classnames';
import Attendee from '../../../server/models/attendee';
import Cow from '../icons/Cow';
import Fish from '../icons/Fish';
import Vegetarian from '../icons/Vegetarian';
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

interface WeddingBreakfastCardContentProps {
	selected: Pick<FoodChoice, 'starter' | 'main'>;
	starterSelect: (choice: 'meat' | 'fish' | 'vegetarian') => any;
	mainSelect: (choice: 'meat' | 'fish' | 'vegetarian') => any;
}

export const WeddingBreakfastCardContent = ({ selected, starterSelect, mainSelect }: WeddingBreakfastCardContentProps) => {
	return (
		<div className="dietry-requirements">
			<p>Please choose your preferred dietry requirements</p>
			<div className="dietry-requirements-preferences">
				<div className="non-vegetarian">
					<div className="starters course">
						<header>Starters</header>
						<small>Choose an option for your starter</small>
						<div className="course-options">
							<div className={cx('course-options-option', { selected: selected && selected.starter === 'meat' })}>
								<figure onClick={() => starterSelect('meat')}>
									<Cow />
								</figure>
								<header>Meat</header>
							</div>
							<div className={cx('course-options-option', { selected: selected && selected.starter === 'fish' })}>
								<figure onClick={() => starterSelect('fish')}>
									<Fish />
								</figure>
								<header>Fish</header>
							</div>
						</div>
					</div>
					<div className="main-courses course">
						<header>Main Course</header>
						<small>Choose an option for your mains</small>
						<div className="course-options">
							<div className={cx('course-options-option', { selected: selected && selected.main === 'meat' })}>
								<figure onClick={() => mainSelect('meat')}>
									<Cow />
								</figure>
								<header>Meat</header>
							</div>
							<div className={cx('course-options-option', { selected: selected && selected.main === 'fish' })}>
								<figure onClick={() => mainSelect('fish')}>
									<Fish />
								</figure>
								<header>Fish</header>
							</div>
						</div>
					</div>
				</div>
				<div className="vegetarian">
					<hr />
					<div className="course">
						<h3>OR</h3>
						<small>Optionally, vegetarian meals are available for those who require them. Select vegetarian below if your dietry requirements suggest so.</small>
						<div className="course-options">
							<div
								className={cx('course-options-option', {
									selected: selected && selected.starter === 'vegetarian' && selected.main === 'vegetarian',
								})}
							>
								<div className="vegetarian-icon">
									<figure onClick={() => { starterSelect('vegetarian').then(() => mainSelect('vegetarian')); }}>
										<Vegetarian />
									</figure>
									<header>Vegetarian</header>
								</div>
							</div>
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
					{this.props.attendees.map(attendee => {
						const { dietFeedbackRequired } = attendee;
						return (
							<div key={attendee.id} className={cx('rsvp', { 'full-card': dietFeedbackRequired })}>
								<header>{attendee.firstName} {attendee.lastName}</header>
								<div className="content">
									<ReceptionCardContent
										attendee={attendee}
										selectedEvents={this.props.selectedEvents[attendee.id]}
										selectEvent={this.props.onSelectEvent}
									/>
									{dietFeedbackRequired &&
										<WeddingBreakfastCardContent
											selected={this.props.foodSelections[attendee.id]}
											starterSelect={(choice) => this.props.onSelectStarter(attendee.id, choice)}
											mainSelect={(choice) => this.props.onSelectMains(attendee.id, choice)}
										/>
									}
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
