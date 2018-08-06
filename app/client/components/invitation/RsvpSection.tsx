import './rsvp-section.scss';
import * as React from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
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
							<p>Oriental beef salad</p>
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
							<p>Prawns and avacados Tian with mango salsa and sweet chilli sauce</p>
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
							<p>Braised lamb shank with creamy mash, roasted shallots and jus</p>
						</div>
						<div
							onClick={() => mainSelect('fish')}
							className={cx('course-options-option', 'checkbox-group', { selected: selected && selected.main === 'fish' })}
						>
							<figure className="custom-checkbox">
								<Fish />
							</figure>
							<p>Stone bass with herbs crushed potatoes and fennel salads</p>
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

const RSVP = (props) => (
	<React.Fragment>
		<h2 className="section-title"><span>Please reply</span> Répondez s'il vous plaît</h2>
		<p>Please send your response by<br/><strong>July 31st</strong><br/>Responses after this date has passed will not be counted and your place will not be guaranteed.</p>
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
		<div className="row rsvps dietry-feedback">
			{this.props.attendees.map(attendee => {
				const dietFeedbackRequired = this.props.dietryRequiredEvents.some(eventId => {
					return this.props.selectedEvents[attendee.id][eventId];
				});
				const foodSelections = this.props.foodSelections[attendee.id];
				return (
					dietFeedbackRequired ?
						<div key={attendee.id} className={cx('rsvp')}>
							<header>{attendee.firstName} {attendee.lastName}</header>
							{(!foodSelections.starter || !foodSelections.main) && (
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
			{this.props.isAnUpdate ?  'Update' : 'Send'} your RSVP
		</button>
	</React.Fragment>
);

export default class RsvpSection extends React.Component<Props> {
	render() {
		const now = moment().tz("Europe/London");
		const dueDate = moment('2018-07-31').tz("Europe/London");
		const entriesClosed = now.isAfter(dueDate);
		return (
			<div className="section section-rsvp">
				{entriesClosed ?
					<div className="yd-container">
						<h2>Responses are now closed</h2>
						<p>You will receive an email closer to the date with more info</p>
						<p>Thank you x</p>
					</div> :
					(this.props.disabled ?
						<div className="yd-container">
							<p>Your reply has been received.</p>
							<p>However, should anything change, you can edit your response by clicking the edit response button below. Your Response cannot be changed after the 30th June</p>
							<button className="uk-button" onClick={this.props.onEnable}>Edit response</button>
						</div> :
						<RSVP
							attendees={this.props.attendees}
							selectedEvents={this.props.selectedEvents}
							onSelectEvent={this.props.onSelectEvent}
							foodSelections={this.props.foodSelections}
							dietryRequiredEvents={this.props.dietryRequiredEvents}
							onSelectStarter={this.props.onSelectStarter}
							onSelectMains={this.props.onSelectMains}
							onAllergiesChange={this.props.onAllergiesChange}
						/>
					)
				}
			</div>
		);
	}
}
