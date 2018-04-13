import * as React from 'react';
// import * as UIkit from 'uikit'
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { editAttendee, deleteAttendees } from '../api/attendee';
import '../styles/admin.scss';
import Router from 'next/router';
import withModal, { ChildProps as WithModalProps } from '../components/withModal';
import {IAttendee } from '../../../server/types/models';

interface State {
	firstName: string;
	lastName: string;
	email: string;
}

interface Props extends WithModalProps {
	attendee: IAttendee;
}

class AttendeeEdit extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => ({
		attendee: (res ?
			res.locals.attendee :
			null
		),
	})

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
			.catch(err => {
				console.error(err)
				alert('Ooops, something went wrong :( \n Try again later');
			});
	}

	confirmDelete = () => {
		this.props.showConfirmModal({
			title: 'Are you sure',
			body: 'This operation is irreversable and cannot be undone. Are you sure you would like to delete this attendee?',
		})
		.then(() => deleteAttendees([this.props.attendee.id]))
		.then(() => Router.push('/admin/attendees'))
		.catch(e => {
			console.error(e)
			alert('Ooops, something went wrong :( \n Try again later');
		});
	}

	render() {
		return (
			<form className="uk-container">
				<div className="uk-margin">
					<label>First name</label>
					<input
						type="text"
						value={this.state.firstName}
						onChange={({target}) => this.onChange(target, 'firstName')}
						className="uk-input"
						placeholder="First name"
					/>
				</div>
				<div className="uk-margin">
					<label>Last name</label>
					<input
						type="text"
						value={this.state.lastName}
						onChange={({target}) => this.onChange(target, 'lastName')}
						className="uk-input"
						placeholder="Last name"
					/>
				</div>
				<div className="uk-margin">
					<label>Email</label>
					<input
						type="email"
						value={this.state.email}
						onChange={({target}) => this.onChange(target, 'email')}
						className="uk-input"
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

export default withModal(
	withAdmin({ title: 'Attendees' }, AttendeeEdit),
);
