import * as React from 'react';
import cx from 'classnames';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import AttendeeSearch from '../components/AttendeeSearch';
import adminCss from '../styles/admin.scss';
import { searchForAttendee } from '../api/attendee';
import { createSendGroup, editSendGroup } from '../api/sendGroup';

class CreateSendGroupScreen extends React.Component {
	static getInitialProps = async ({ res }) => {
		if (!res) {
			return {};
		}

		const { sendGroup, attendees } = res.locals;

		return {
			sendGroup,
			attendees,
			edit: !!sendGroup,
		};
	}

	state = {
		sendGroup: {
			name: '',
			email: '',
		},
		attendees: [],
		selectedAttendees: {},
	};

	componentWillMount() {
		let state: {[key:string]: any} = {};
		const { sendGroup, attendees } = this.props;

		if (sendGroup) {
			state.sendGroup = sendGroup;
		}

		if (attendees) {
			const selectedAttendees = attendees.reduce((accum, attendee) => ({
				...accum,
				[attendee.id]: attendee,
			}), {});

			state.selectedAttendees = selectedAttendees;
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

	creategroup = () => {
		const attendeeIds = Object.keys(this.state.selectedAttendees);
		const { name, email, id } = this.state.sendGroup;

		const sendGroupMutation = (id ?
			editSendGroup(id, {name, email}, attendeeIds) :
			createSendGroup({name, email }, attendeeIds)
		);

		return sendGroupMutation.then(() => Router.push('/admin/sendgroups'));
	}

	renderSelectedAttendees() {
		return Object.keys(this.state.selectedAttendees).map(attendeeId => {
			const attendee = this.state.selectedAttendees[attendeeId];
			return (
				<div
					key={`selected-attendee-${attendeeId}`}
					className="uk-card uk-card-default uk-card-small uk-margin"
				>
					<div className="uk-card-badge uk-label">Primary</div>
					<div className="uk-card-header uk-flex uk-flex-middle">
						<i className="material-icons">account_circle</i>
						<div className="uk-margin-left">
							<h5 className="uk-card-title uk-margin-remove-bottom">{attendee.firstName} {attendee.lastName}</h5>
							<p className="uk-text-meta uk-margin-remove-top">
								<time>{attendee.email}</time>
							</p>
						</div>
					</div>
					<div className="uk-card-body uk-clearfix">
						<button
							onClick={() => this.removeFromGroup(attendeeId)}
							style={{fontSize: '0.8rem'}}
							className="uk-button uk-button-text uk-float-right uk-margin-left"
						>
							Remove from group
						</button>
						<button
							style={{fontSize: '0.8rem'}}
							className="uk-button uk-button-link uk-float-right"
						>
							Make Primary
						</button>
					</div>
				</div>
			);
		});
	}

	removeFromGroup(attendeeId) {
		const newSelectedAttendees = { ...this.state.selectedAttendees };
		delete newSelectedAttendees[attendeeId];
		this.setState({ selectedAttendees: newSelectedAttendees });
	}

	updateName = (e) => {
		const sendGroup = {...this.state.sendGroup}
		sendGroup.name = e.target.value;
		this.setState({ sendGroup });
	}

	updateEmail = (e) => {
		const sendGroup = {...this.state.sendGroup}
		sendGroup.email = e.target.value;
		this.setState({ sendGroup });
	}

	render() {
		console.log(this.state, this.props);
		const { name, email } = this.state.sendGroup;
		const selectedAttendeeIds = Object.keys(this.state.selectedAttendees);
		return (
			<div>
				<h2>Create a send group</h2>
				<section className="uk-section uk-padding uk-section-default">
					<h3 className="uk-margin">Group details</h3>
					<form className="uk-margin-top">
						<div className={adminCss['form-group']}>
							<label>Group name</label>
							<input
								className={adminCss['form-control']}
								type="text"
								value={name}
								onChange={this.updateName}
							/>
						</div>
						<div className={cx(adminCss['form-group'])}>
							<label>Add members</label>
							<AttendeeSearch
								onChange={this.attendeeSearch}
								onClick={this.selectAttendee}
								data={this.state.attendees}
							/>
						</div>
					</form>
				</section>
				<div className="uk-section-muted uk-padding">
					<h3 className="uk-margin">Selected Attendees</h3>
					{selectedAttendeeIds.length > 0 && this.renderSelectedAttendees()}
				</div>
				<section className="uk-section uk-padding uk-section-default">
					<div className={adminCss['form-group']}>
						<label>Email for group</label>
						<input
							className={adminCss['form-control']}
							type="email"
							value={email}
							onChange={this.updateEmail}
						/>
					</div>
				</section>
				<div className="uk-clearfix uk-margin uk-margin-large-top">
					<button
						onClick={this.creategroup}
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
