import * as React from 'react';
// import * as UIkit from 'uikit'
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { editAttendee, deleteAttendees } from '../api/attendee';
import '../styles/admin.scss';
import Router from 'next/router';
import withModal from '../components/withModal';

class AttendeeEdit extends React.Component {
	constructor(props) {
		super(props);
		if (props.attendee) {
			const { firstName, lastName, email } = props.attendee;
			this.state = {
				firstName, lastName, email,
			};
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

	confirmDelete = () => {
		this.props.showConfirmModal({
			title: 'Are you sure',
			body: 'This operation is irreversable and cannot be undone. Are you sure you would like to delete this attendee?',
		})
		.then(() => deleteAttendees([this.props.attendee.id]))
		.then(() => Router.push('/admin/attendees'))
		.catch(() => undefined);
	}

	render() {
		return (
			<form>
				<div className="form-group">
					<label>First name</label>
					<input
						type="text"
						value={this.state.firstName}
						onChange={({target}) => this.onChange(target, 'firstName')}
						className="form-control"
						placeholder="First name"
					/>
				</div>
				<div className="form-group">
					<label>Last name</label>
					<input
						type="text"
						value={this.state.lastName}
						onChange={({target}) => this.onChange(target, 'lastName')}
						className="form-control"
						placeholder="Last name"
					/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						value={this.state.email}
						onChange={({target}) => this.onChange(target, 'email')}
						className="form-control"
						placeholder="Last name"
					/>
				</div>
				<Link href="attendees" as="/admin/attendees">
					<div className="uk-button uk-button-default">Cancel</div>
				</Link>
				<div onClick={this.submit} className="uk-margin-left uk-button uk-button-primary">Save</div>
				<div className="uk-clearfix">
					<div onClick={this.confirmDelete} className="uk-float-right uk-button uk-button-text">Delete</div>
				</div>
			</form>
		);
	}
}

AttendeeEdit.getInitialProps = async ({ req, res }) => ({
	attendee: (res ?
		res.locals.attendee :
		null
	),
});

export default withModal(
	withAdmin({ title: 'Attendees' }, AttendeeEdit),
);
