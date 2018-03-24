import * as React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import { editAttendee } from '../api/attendee';
import adminCss from '../styles/admin.scss';
import Router from 'next/router';

class AttendeeEdit extends React.Component {
	constructor(props) {
		super(props)
		if (props.attendee) {
			const { firstName, lastName, email } = props.attendee;
			this.state = {
				firstName, lastName, email
			}
		}
	}

	onChange({value}, key) {
		this.setState({ [key]: value });
	}

	submit = () => {
		editAttendee(this.props.attendee.id, this.state)
			.then(() => Router.push('/admin/attendees'))
			.catch(err => console.error(err));
	}

	render() {
		return (
			<div>
				<AdminLayout title="Attendees">
					<form>
						<div className={adminCss['form-group']}>
							<label>First name</label>
							<input
								type="text"
								value={this.state.firstName}
								onChange={({target}) => this.onChange(target, 'firstName')}
								className={adminCss['form-control']}
								placeholder="First name"
							/>
						</div>
						<div className={adminCss['form-group']}>
							<label>Last name</label>
							<input
								type="text"
								value={this.state.lastName}
								onChange={({target}) => this.onChange(target, 'lastName')}
								className={adminCss['form-control']}
								placeholder="Last name"
							/>
						</div>
						<div className={adminCss['form-group']}>
							<label>Email</label>
							<input
								type="email"
								value={this.state.email}
								onChange={({target}) => this.onChange(target, 'email')}
								className={adminCss['form-control']}
								placeholder="Last name"
							/>
						</div>
						<Link href="/admin/attendees">
							<div className="uk-button uk-button-default">Cancel</div>
						</Link>
						<div onClick={this.submit} className="uk-margin-left uk-button uk-button-primary">Save</div>
						<div className="uk-clearfix">
							<div className="uk-float-right uk-button uk-button-text">Delete</div>
						</div>
					</form>
				</AdminLayout>
			</div>
		)
	}
}

AttendeeEdit.getInitialProps = async ({ req, res }) => ({
	attendee: (res ?
		res.locals.attendee :
		null
	)
});

export default AttendeeEdit;