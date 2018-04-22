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

interface WeddingBreakfastCardContentProps {
	selected: Pick<FoodChoice, 'starter' | 'main'>;
	starterSelect: (choice: 'meat' | 'fish' | 'vegetarian') => any;
	mainSelect: (choice: 'meat' | 'fish' | 'vegetarian') => any;
	onAllergiesChange: (value: string) => any;
}

interface ReceptionCardContentProps {
	attendee: Attendee;
	selectEvent: Props['onSelectEvent'];
	selectedEvents: Props['selectedEvents']['attendeeId'];
	displayFoodChoiceNote?: boolean;
}

interface Props {
	attendees: AttendeeWithDietOptions[];
	selectedEvents: {
		[attendeeId: string]: {
			[eventId: string]: boolean;
		};
	};
	dietryRequiredEvents: string[];
	isAnUpdate: boolean;
	foodSelections: {
		[attendeeId: string]: {
			starter: 'meat' | 'fish' | 'vegetarian',
			main: 'meat' | 'fish' | 'vegetarian',
			allergies: string;
			valid: boolean;
		},
	};
	disabled: boolean;
	pristine: boolean;
	onSubmit: () => any;
	onEnable: () => any;
	onSelectEvent: (attendeeId: string, eventId: string, value: boolean) => any;
	onSelectStarter?: (attendeeId: string, choice: 'meat' | 'fish' | 'vegetarian') => Promise<any>;
	onSelectMains?: (attendeeId: string, choice: 'meat' | 'fish' | 'vegetarian') => Promise<any>;
	onAllergiesChange?: (attendeeId: string, value: string) => any;
}

const ReceptionCardContent = (props: ReceptionCardContentProps) => {
	const {attendee, selectEvent, selectedEvents, displayFoodChoiceNote = true} = props;
	return (
		<div className="attendance">
			<p><small>Please tap to select / unselect an event</small></p>
			<div>
				{attendee.Events.map(eventService => {
					const isSelected = selectedEvents[eventService.id];
					return (
						<div key={eventService.id}>
							<div
								className={cx('checkbox-group', {selected: isSelected})}
								onClick={() => selectEvent(attendee.id, eventService.id, !isSelected)}
							>
								<i className="custom-checkbox material-icons">check</i>
								<label className="form-check-label">
									{eventService.name}
									{displayFoodChoiceNote && eventService.dietFeedback && isSelected && (
										<small className="note">Don't forget to make your food selection below</small>
									)}
								</label>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const WeddingBreakfastCardContent = ({ selected, starterSelect, mainSelect, onAllergiesChange }: WeddingBreakfastCardContentProps) => {
	return (
		<div className="dietry-requirements">
			<header>Choose your food options:</header>
			<div className="food-choices">
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
							<figure className="custom-checkbox">
								<Cow />
							</figure>
							<p>Corn fed chicken terrine, with apple puree, red chicory and onion rings</p>
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
							<figure className="custom-checkbox">
								<Fish />
							</figure>
							<p>Smoked salmon with pickled beetroot, horseradish abd seaweed cracker</p>
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
							<figure className="custom-checkbox">
								<Cow />
							</figure>
							<p>Corn feed chicken with mushrooms, sweet potato puree and tarragon suce</p>
						</div>
						<div
							onClick={() => mainSelect('fish')}
							className={cx('course-options-option', 'checkbox-group', { selected: selected && selected.main === 'fish' })}
						>
							<figure className="custom-checkbox">
								<Fish />
							</figure>
							<p>Roast salmon with red pepper compote and pomegranate vinaigrette</p>
						</div>
					</div>
				</div>
			</div>
			<div className="allergies">
				<label>Allergies and special requirements:</label>
				<textarea
					className="input-material"
					value={selected.allergies}
					onChange={e => onAllergiesChange(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default class RsvpSection extends React.Component<Props> {
	render() {
		return (
			<div className="section section-rsvp">
				{this.props.disabled ?
					<div className="yd-container">
						<p>Your reply has been received.</p>
						<p>However, should anything change, you can edit your response by clicking the edit response button below. Your Response cannot be changed after the 30th June</p>
						<button className="uk-button" onClick={this.props.onEnable}>Edit response</button>
					</div> :
					<React.Fragment>
						<h2 className="section-title"><span>Please reply</span> Répondez s'il vous plaît</h2>
						<p>Please send your response by<br/><strong>May 31st</strong><br/>Responses after this date has passed will not be counted and your place will not be guaranteed.</p>
						<div className="row rsvps">
							{this.props.attendees.map(attendee =>  (
								<div key={attendee.id} className="rsvp">
									<header>{attendee.firstName}{!!attendee.lastName && ' ' + attendee.lastName}</header>
									<div className="content">
										<ReceptionCardContent
											attendee={attendee}
											selectedEvents={this.props.selectedEvents[attendee.id]}
											selectEvent={this.props.onSelectEvent}
											displayFoodChoiceNote={!this.props.foodSelections[attendee.id].valid}
										/>
									</div>
								</div>
								))}
						</div>
						<div className="row dietry-feedback">
							{this.props.attendees.map(attendee => {
								const dietFeedbackRequired = this.props.dietryRequiredEvents.some(eventId => {
									return this.props.selectedEvents[attendee.id][eventId];
								});
								const foodSelections = this.props.foodSelections[attendee.id];
								return (
									dietFeedbackRequired ?
										<div key={attendee.id} className={cx('rsvp')}>
											<header>{attendee.firstName} {attendee.lastName}</header>
											{!this.props.pristine && !foodSelections.starter || !foodSelections.main && (
												<div className="error-alert">
													<i className="material-icons">error</i>
													<span>
														Choose{' '}
														{!foodSelections.starter && 'a starter'}
														{!foodSelections.starter && !foodSelections.main && ' and '}
														{!foodSelections.main && 'a main'}
													</span>
												</div>
											)}
											{dietFeedbackRequired &&
												<WeddingBreakfastCardContent
													selected={foodSelections}
													starterSelect={(choice) => this.props.onSelectStarter(attendee.id, choice)}
													mainSelect={(choice) => this.props.onSelectMains(attendee.id, choice)}
													onAllergiesChange={(value) => this.props.onAllergiesChange(attendee.id, value)}
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
					</React.Fragment>
				}
			</div>
		);
	}
}
