import * as React from 'react';
import cx from 'classnames';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import AttendeeSearch from '../components/AttendeeSearch';
import adminCss from '../styles/admin.scss';
import { searchForAttendee } from '../api/attendee';
import { createSendGroup } from '../api/sendGroup';

class CreateSendGroupScreen extends React.Component {
	state = {
		name: '',
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
		const { name } = this.state;
		return createSendGroup({name}, attendeeIds).then(() => {
			Router.push('/admin/sendgroups');
		});
	}

	renderSelectedAttendees() {
		return Object.keys(this.state.selectedAttendees).map(attendeeId => {
			const attendee = this.state.selectedAttendees[attendeeId];
			return (
				<div
					key={`selected-attendee-${attendeeId}`}
					className="uk-card uk-card-default uk-card-small"
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
		this.setState({ selectedAttendees: newSelectedAttendees })
	}

	render() {
		const { name } = this.state;
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
								onChange={e => this.setState({ name: e.target.value })}
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
