import * as React from 'react';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { searchForAttendee } from '../api/attendee';
import { createSendGroup } from '../api/sendGroup';
import AttendeeGroupForm from '../components/attendeeGroupForm';

class CreateSendGroupScreen extends React.Component {
	state = {
		name: '',
		email: '',
		attendees: [],
		selectedAttendees: {},
	};

	attendeeSearch = (e) => {
		const searchValue = e.target.value;
		if (searchValue.length > 2) {
			return searchForAttendee(searchValue).then(attendees => {
				this.setState({ attendees });
			});
		}
		return this.setState({ attendees: [] });
	}

	selectAttendee = (attendee) => {
		this.setState({
			selectedAttendees: {
				...this.state.selectedAttendees,
				[attendee.id]: attendee,
			},
		});
	}

	creategroup = () => {
		const attendeeIds = Object.keys(this.state.selectedAttendees);
		const { name, email } = this.state;
		return createSendGroup({name, email }, attendeeIds).then(() => Router.push('/admin/sendgroups'));
	}

	removeFromGroup = (attendeeId) => {
		const newSelectedAttendees = { ...this.state.selectedAttendees };
		delete newSelectedAttendees[attendeeId];
		this.setState({ selectedAttendees: newSelectedAttendees });
	}

	onChange = (e, valueType) => {
		if (valueType === 'email') {
			this.setState({ email: e.target.value });
		}
		if (valueType === 'groupName') {
			this.setState({ name: e.target.value });
		}
	}

	render() {
		return (
			<div>
				<h2>Create a send group</h2>
				<AttendeeGroupForm
					groupName={this.state.name}
					email={this.state.email}
					attendeesSearchResults={this.state.attendees}
					selectedAttendees={this.state.selectedAttendees}
					onSearch={this.attendeeSearch}
					onChange={this.onChange}
					removeAttendee={this.removeFromGroup}
					onSelectAttendee={this.selectAttendee}
				/>
				<div className="uk-clearfix uk-margin uk-margin-large-top">
					<button
						onClick={this.creategroup}
						className="uk-float-right uk-button uk-button-primary"
					>
						Create
					</button>
				</div>
			</div>
		);
	}
}

export default withAdmin({ title: 'Send Groups' }, CreateSendGroupScreen);
