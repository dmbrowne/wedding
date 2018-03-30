import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import '../styles/admin.scss';
import { createAttendees } from '../api/attendee';
import Router from 'next/router';

const blankAttendee = {
	firstName: '',
	lastName: '',
	email: '',
};

class NewAttendee extends React.Component {
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
		createAttendees(this.state.newAttendees).then(() => {
			Router.push('/admin/attendees');
		});
	}

	render() {
		return (
			<form>
				{this.state.newAttendees.map((attendee, idx) => {
					const { firstName, lastName, email} = attendee;
					return (
						<fieldset
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
							<div className="form-group">
								<input
									type="text"
									value={firstName}
									onChange={e => this.updateAttendeeField(e, idx, 'firstName')}
									className="form-control"
									placeholder="First name"
								/>
							</div>
							<div className="form-group">
								<input
									type="text"
									value={lastName}
									onChange={e => this.updateAttendeeField(e, idx, 'lastName')}
									className="form-control"
									placeholder="Last name"
								/>
							</div>
							<div className="form-group">
								<input
									type="email"
									value={email}
									onChange={e => this.updateAttendeeField(e, idx, 'email')}
									className="form-control"
									placeholder="Enter email"
								/>
							</div>
						</fieldset>
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
		);
	}
}

export default withAdmin({ title: 'Attendees' }, NewAttendee);
