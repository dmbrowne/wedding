import * as React from 'react';
import cx from 'classnames';
import AdminLayout from '../components/AdminLayout';
import adminCss from '../styles/admin.scss';
import { createAttendees } from '../api/attendee';
import Router from 'next/router';

const blankAttendee = {
	firstName: '',
	lastName: '',
	email: '',
}

class NewAttendee extends React.Component {
	state = {
		newAttendees: [
			{ ...blankAttendee }
		]
	}

	updateAttendeeField({ target }, idx, keyName) {
		const attendees = [...this.state.newAttendees];
		attendees[idx][keyName] = target.value;
		this.setState({ newAttendees: attendees })
	}

	addAttendeeField() {
		this.setState({
			newAttendees: [
				...this.state.newAttendees,
				{ ...blankAttendee }
			]
		})
	}

	deleteAttendee(idx) {
		const attendees = [...this.state.newAttendees];
		attendees.splice(idx, 1);
		this.setState({ newAttendees: attendees })
	}

	submit() {
		createAttendees(this.state.newAttendees).then(result => {
			Router.push('/admin/attendees');
		})
	}

	render() {
		return (
			<div>
				<AdminLayout title="Attendees">
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
									<div className={adminCss['form-group']}>
										<input
											type="text"
											value={firstName}
											onChange={e => this.updateAttendeeField(e, idx, 'firstName')}
											className={adminCss['form-control']}
											placeholder="First name"
										/>
									</div>
									<div className={adminCss['form-group']}>
										<input
											type="text"
											value={lastName}
											onChange={e => this.updateAttendeeField(e, idx, 'lastName')}
											className={adminCss['form-control']}
											placeholder="Last name"
										/>
									</div>
									<div className={adminCss['form-group']}>
										<input
											type="email"
											value={email}
											onChange={e => this.updateAttendeeField(e, idx, 'email')}
											className={adminCss['form-control']}
											placeholder="Enter email"
										/>
									</div>
								</fieldset>
							)
						})}
						<div className="uk-clearfix">
							<adminCss
								onClick={() => this.addAttendeeField()}
								className="uk-button uk-button-default uk-float-left"
							>
								Add More
							</adminCss>
							<adminCss
								onClick={() => this.submit()}
								className="uk-button uk-button-primary uk-float-right"
							>
								Submit
							</adminCss>
						</div>
					</form>
				</AdminLayout>
			</div>
		)
	}
}

export default NewAttendee;