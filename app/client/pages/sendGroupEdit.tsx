import * as React from 'react';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { searchForAttendee } from '../api/attendee';
import { getSendGroups, editSendGroup } from '../api/sendGroup';
import AttendeeGroupForm from '../components/attendeeGroupForm';
import { IAttendee, ISendGroup } from '../../server/types/models';

interface State extends Pick<ISendGroup, 'id' | 'name' | 'email'> {
	attendees: IAttendee[];
	selectedAttendees: {
		[key: string]: IAttendee,
	};
}

interface Props {
	sendGroup: Pick<ISendGroup, 'id' | 'name' | 'email'>;
	attendees: IAttendee[] | null;
}

class CreateSendGroupScreen extends React.Component<Props, State> {
	static getInitialProps = async ({ res, query }) => {
		const sendGroup = !!res ?
			res.locals.sendGroup :
			await getSendGroups(query.sendGroupId);
		const attendees = sendGroup.Attendees || [];
		delete sendGroup.Attendees;

		return {
			sendGroup,
			attendees,
		};
	}

	state = {
		id: '',
		name: '',
		email: '',
		selectedAttendees: {},
		attendees: [],
	};

	componentWillMount() {
		const selectedAttendees = this.props.attendees.reduce((accum, attendee) => ({
			...accum,
			[attendee.id]: attendee,
		}), {});

		const { id, name, email } = this.props.sendGroup;

		const state = {
			id,
			name,
			email,
			selectedAttendees,
		}
		this.setState(state);
	}

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

	removeFromGroup = (attendeeId) => {
		const newSelectedAttendees = { ...this.state.selectedAttendees };
		delete newSelectedAttendees[attendeeId];
		this.setState({ selectedAttendees: newSelectedAttendees });
	}

	save = () => {
		const attendeeIds = Object.keys(this.state.selectedAttendees);
		const { name, email, id } = this.state;
		return editSendGroup(id, {name, email}, attendeeIds).then(() => Router.push('/admin/sendgroups'));
	}

	updateName = (e) => {
		const sendGroup = {...this.state };
		sendGroup.name = e.target.value;
		this.setState({ ...sendGroup });
	}

	updateEmail = (e) => {
		const sendGroup = {...this.state };
		sendGroup.email = e.target.value;
		this.setState({ ...sendGroup });
	}

	onChange = (e, keyName: 'email' | 'groupName') => {
		if (keyName === 'email') {
			this.updateEmail(e);
		}
		if (keyName === 'groupName') {
			this.updateName(e);
		}
	}

	render() {
		return (
			<div>
				<h2>Create a send group</h2>
				<AttendeeGroupForm
					email={this.state.email}
					groupName={this.state.name}
					onChange={this.onChange}
					attendeesSearchResults={this.state.attendees}
					selectedAttendees={this.state.selectedAttendees}
					onSelectAttendee={this.selectAttendee}
					onSearch={this.attendeeSearch}
					removeAttendee={this.removeFromGroup}
				/>
				<div className="uk-clearfix uk-margin uk-margin-large-top">
					<button
						onClick={this.save}
						className="uk-float-right uk-button uk-button-primary"
					>
						Save
					</button>
				</div>
			</div>
		);
	}
}

export default withAdmin({ title: 'Send Groups' }, CreateSendGroupScreen);
