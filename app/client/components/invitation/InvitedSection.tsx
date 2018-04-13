import './invitedSection.scss';
import * as React from 'react';
import AttendeeNames, { Props as AttendeeNamesProps } from './AttendeeNames';

interface Props extends AttendeeNamesProps {
	singleInvitation: boolean;
	onGoToRsvp: (buttonElement: HTMLElement) => any;
}

export default class InvitedSection extends React.Component<Props> {
	goToRsvp: HTMLElement = null;

	attendeesComponent() {
		return <AttendeeNames attendees={this.props.attendees} />;
	}

	singleMessage() {
		return (
			<p>
				{this.attendeesComponent()}, It would mean the world to us if you could join us for this very special time, and we would love it if you could be there.
			</p>
		);
	}

	groupMessage() {
		return (
			<React.Fragment>
				<p>{this.attendeesComponent()}</p>
				<p>
					It would mean the world to us if you could join us for this very special time, and we would love it if you could be there.
				</p>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div className="section section-invited">
				<div className="container">
					<h2 className="section-title"><span>You're</span>Invited</h2>
					<p>With great pleasure</p>
					<p><span className="fancy">Yasmin Obosi</span> and <span className="fancy">Daryl Browne</span></p>
					<p>invite you to join them at the celebration of their marriage.</p>
					<br/>
					{this.props.singleInvitation ? this.singleMessage() : this.groupMessage()}
					<p>Click the button below to confirm your attendance / absence now,</p>
					<button
						ref={ref => this.goToRsvp = ref}
						className="go-to-rsvp"
						onClick={() => this.props.onGoToRsvp(this.goToRsvp)}
					>
						RSVP
					</button>
					<p>... Or read on for more details...</p>
				</div>
			</div>
		);
	}
}
