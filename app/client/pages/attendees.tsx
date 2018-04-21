import * as React from 'react';
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import Modal from '../components/Modal';
import { deleteAttendees, getAllAttendees } from '../api/attendee';
import { createSendGroup, getSendGroups, editSendGroup } from '../api/sendGroup';
import CheckboxTable from '../components/CheckboxTable';
import Attendee from '../../server/models/attendee';
import SendGroup from '../../server/models/sendGroup';
import AttendeeNames from '../components/invitation/AttendeeNames';

interface State {
	showSendGroupsModal: boolean;
	onlyShowEmailableAttendees: boolean;
	attendees: {
		[attendeeId: string]: Attendee;
	};
	attendeesOrder: string[];
	selected: {
		[attendeeId: string]: any;
	};
	newSendGroup?: {
		name: string;
		email: string;
	};
	sendGroups?: SendGroup[];
	selectedSendGroupId?: string;
}

interface Props {
	attendees: Attendee[];
}

class Attendees extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => {
		return {
			attendees: res ? res.locals.attendees : await getAllAttendees(),
		};
	}

	constructor(props) {
		super(props);
		const onlyShowEmailableAttendees = false;
		this.state = {
			showSendGroupsModal: false,
			selected: {},
			onlyShowEmailableAttendees,
			...this.attendeeList([...this.props.attendees], onlyShowEmailableAttendees),
		};
	}

	renderHeader() {
		return (
			<tr>
				<th>First name</th>
				<th>Last name</th>
				<th className="uk-expand">Email</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow(attendee, onCheckboxTick, itemIsChecked) {
		return (
			<tr key={`attendee-row-${attendee.id}`}>
				<td>{attendee.firstName}</td>
				<td>{attendee.lastName}</td>
				<td>{attendee.email}</td>
				<td>
					<Link href={`/admin/attendees/${attendee.id}`}>
						<i className="material-icons">mode_edit</i>
					</Link>
				</td>
				<td>
					<input
						type="checkbox"
						className="uk-checkbox"
						checked={itemIsChecked}
						onChange={(e) => onCheckboxTick(e)}
					/>
				</td>
			</tr>
		);
	}

	attendeeList = (attendees, onlyShowEmailableAttendees = this.state.onlyShowEmailableAttendees) => {
		const order = attendees.map(attendee => attendee.id);
		const attendeesList = attendees.reduce((accum, attendee) => ({ ...accum, [attendee.id]: attendee }), {});
		return {
			attendeesOrder: onlyShowEmailableAttendees ? order.filter(attendeeId => !!attendeesList[attendeeId].email) : order,
			attendees: attendeesList,
		};
	}

	refreshList() {
		getAllAttendees()
			.then(attendees => {
				this.setState({
					...this.attendeeList(attendees),
				});
			})
			.catch(e => {
				console.log(e)
				alert('There was an error refreshing the list. Try manually refreshing');
			});
	}

	onDelete = (ids) => {
		deleteAttendees(ids)
			.then(() => this.refreshList())
			.catch(e => {
				console.log(e)
				alert('Something went wrong with the deletion, try again later');
			});
	}

	openSendGroupModal = () => {
		getSendGroups()
			.then(sendGroups => this.setState({ sendGroups }));

		this.setState({
			showSendGroupsModal: true,
			newSendGroup: {
				name: '',
				email: '',
			},
		});
	}

	createSendGroupWithAttendees = () => {
		return createSendGroup(this.state.newSendGroup, Object.keys(this.state.selected))
			.then(() => {
				alert('Created!');
				this.setState({
					newSendGroup: null,
					showSendGroupsModal: false,
				});
			})
			.catch(() => alert('There was an error creating the sendgroup'));
	}

	addAttendeesToExistingSendGroup = (groupId) => {
		return editSendGroup(groupId, null, Object.keys(this.state.selected))
			.then(() => {
				alert('Added!');
				this.setState({
					newSendGroup: null,
					showSendGroupsModal: false,
				});
			})
			.catch(() => alert('There was an error adding the attendees to the sendgroup'));
	}

	renderSendGroupListRow = (sendGroup) => {
		return (
			<li
				key={sendGroup.id}
				className="uk-clearfix"
			>
				<span className="uk-float-left">{sendGroup.name}</span>
				<div className="uk-float-right">
					{this.state.selectedSendGroupId === sendGroup.id ?
						<React.Fragment>
							<button
								className="uk-button uk-button-small uk-button-default"
								onClick={() => this.setState({ selectedSendGroupId: null})}
							>
								No
							</button>
							<button
								onClick={() => this.addAttendeesToExistingSendGroup(sendGroup.id)}
								className="uk-button uk-button-small uk-button-primary"
							>
								Yes
							</button>
						</React.Fragment> :
						<button
							onClick={() => this.setState({ selectedSendGroupId: sendGroup.id })}
							className="uk-button uk-button-small uk-button-secondary"
						>
							Add
						</button>
					}
				</div>
			</li>
		);
	}

	onSelect(selectMap) {
		const selected = !selectMap ?
			{} :
			Object.keys(selectMap).reduce((accum, attendeeId) => {
				if (!selectMap[attendeeId]) {
					return accum;
				}
				return {
					...accum,
					[attendeeId]: selectMap[attendeeId],
				};
			}, {});
		this.setState({ selected });
	}

	render() {
		const { attendeesOrder, attendees, showSendGroupsModal, sendGroups, selected, onlyShowEmailableAttendees } = this.state;
		return (
			<div className="uk-container">
				<h2>Everyone that you would like to come.</h2>
				<p className="uk-margin-large-bottom">No matter which events you would like them to attend, this list represents
					the total people you would like to attend throughout the day</p>
				<div className="uk-margin">
					<label>
						<input
							type="checkbox"
							className="uk-checkbox"
							checked={onlyShowEmailableAttendees}
							onClick={e => this.setState({ onlyShowEmailableAttendees: e.target.checked })}
						/> Only show attendees with email addresses
					</label>
				</div>
				<CheckboxTable
					data={attendeesOrder.map(attendeeId => attendees[attendeeId])}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					onDelete={this.onDelete}
					onSelect={select => this.onSelect(select)}
					buttons={(
						<Link prefetch={true} href="/attendeeCreate" as="/admin/attendees/new">
							<button className="uk-button-small uk-float-left uk-button uk-button-primary">Add</button>
						</Link>
					)}
					bulkButtons={(
						Object.keys(selected).length > 1 && (
							<button
								onClick={this.openSendGroupModal}
								className="uk-button uk-button-small uk-button-secondary"
							>
								Add to send group...
							</button>
						)
					)}
				/>
				{!!showSendGroupsModal && (
					<Modal
						title="Add to send group"
						onClose={() => this.setState({ showSendGroupsModal: false })}
					>
						<p className="uk-text-lead">
							Send group for{' '}
							<AttendeeNames
								attendees={Object.keys(selected).map(attendeeId => attendees[attendeeId])}
							/>
						</p>
						<div className="uk-section-muted uk-padding-small">
							<header className="uk-text-uppercase">Create new</header>
							<div className="uk-margin-small">
								<input type="text" className="uk-input" placeholder="Name of group" />
								<input type="text" className="uk-input" placeholder="default email" />
								<div className="uk-margin-small uk-clearfix">
									<button
										onClick={this.createSendGroupWithAttendees}
										className="uk-button uk-button-small uk-button-primary uk-float-right"
									>
										Create & add
									</button>
								</div>
							</div>
						</div>
						<div className="uk-section-muted uk-padding-small uk-margin">
						<header className="uk-text-uppercase uk-margin">Or add to an existing group</header>
							{sendGroups &&
								<ul className="uk-list uk-list-divider">
									{sendGroups.map(sendGroup => this.renderSendGroupListRow(sendGroup))}
								</ul>
							}
						</div>
					</Modal>
				)}
			</div>
		);
	}
}

export default withAdmin({ title: 'Attendees'}, Attendees);
