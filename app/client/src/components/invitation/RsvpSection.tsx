import * as React from 'react';
import cx from 'classnames';
import { IAttendee } from '../../../../server/types/models';

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
							<div key={attendee.id} className="rsvp">
								<header>{attendee.firstName} {attendee.lastName}</header>
								<p><small>Please tap to select/unselect an event</small></p>
								<div>
									{attendee.Events.map(eventOccurrence => {
										const isSelected = this.props.selectedEvents[attendee.id][eventOccurrence.id];
										return (
											<div
												key={eventOccurrence.id}
												className={cx('checkbox-group', {active: isSelected})}
												onClick={() => this.props.onSelectEvent(attendee.id, eventOccurrence.id, !isSelected)}
											>
												<i className="custom-checkbox material-icons">check</i>
												<label className="form-check-label">
													{eventOccurrence.name}
												</label>
											</div>
										);
									})}
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
