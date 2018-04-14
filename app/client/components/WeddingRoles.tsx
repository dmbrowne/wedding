import './weddingRoles.scss';
import * as React from 'react';
import {
	getBridalPartyRoles,
	updateBridalPartyRole,
	deleteBridalPartyRoles,
	createBridalPartyRole,
} from "../api/bridalParty";
import CheckboxTable from './CheckboxTable';
import BridalPartyRole from '../../server/models/bridalPartyRoles';

interface WeddingRolesScreenState {
	roles: BridalPartyRole[];
	editMode: {
		[BridalPartyId: string]: boolean,
	};
	editModeChanges: {
		[BridalPartyId: string]: {
			name: string;
			value: string;
		},
	};
	addNewRole: null | { name: string; value: string; };
}

export default class WeddingRolesScreen extends React.Component<any, WeddingRolesScreenState> {
	state = {
		roles: [],
		editMode: {},
		editModeChanges: {},
		addNewRole: null,
	};

	componentDidMount() {
		this.refreshRolesList();
	}
	refreshRolesList = async () => {
		const roles = await getBridalPartyRoles();
		this.setState({ roles });
	}
	renderHeader() {
		return (
			<tr>
				<th>Name</th>
				<th>value</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}
	updateRole = async (id: string, idx, cb) => {
		const input = this.state.editModeChanges[id];
		const updatedRole = await updateBridalPartyRole(id, input);
		const newRoles = [...this.state.roles];
		newRoles[idx] = updatedRole;
		this.setState({roles: newRoles});
		cb();
	}
	onRoleInputUpdate = (id, key, value) => {
		this.setState({
			editModeChanges: {
				...this.state.editModeChanges,
				[id]: {
					...this.state.editModeChanges[id],
					[key]: value,
				},
			},
		});
	}
	onRolesDelete = (ids) => {
		deleteBridalPartyRoles(ids)
			.then(() => this.refreshRolesList())
			.catch(e => alert('Error deleting roles'));
	}
	renderRow = (role: BridalPartyRole, onCheckboxTick, itemIsChecked, idx) => {
		const itemIsInEditMode = this.state.editMode[role.id];
		const enterEditMode = () => this.setState({
			editMode: { ...this.state.editMode, [role.id]: true },
			editModeChanges: {
				[role.id] : {
					name: role.name,
					value: role.value,
				},
			},
		});
		const exitEditMode = () => this.setState({ editMode: { ...this.state.editMode, [role.id]: false }});
		return (
			<tr key={role.id || idx}>
				<td>
					{itemIsInEditMode ?
						<input
							type="text"
							className="uk-inpu uk-form-small"
							value={this.state.editModeChanges[role.id].name}
							onChange={e => this.onRoleInputUpdate(role.id, 'name', e.target.value)}
						/> :
						role.name
					}
				</td>
				<td>
					{itemIsInEditMode ?
						<input
							type="text"
							className="uk-input uk-form-small"
							value={this.state.editModeChanges[role.id].value}
							onChange={e => this.onRoleInputUpdate(role.id, 'value', e.target.value)}
						/> :
						role.value
					}
				</td>
				<td>
					{itemIsInEditMode ?
						<div style={{ display: 'flex' }}>
							<i onClick={exitEditMode} className="material-icons">cancel</i>
							<i onClick={() => this.updateRole(role.id, idx, exitEditMode)} className="material-icons">save</i>
						</div> :
						<i onClick={enterEditMode} className="material-icons">mode_edit</i>
					}
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
	toggleNewRoleOptions = (show) => {
		if (show) {
			this.setState({
				addNewRole: {
					name: '',
					value: '',
				},
			});
		} else {
			this.setState({ addNewRole: null });
		}
	}
	saveNewRole = () => {
		createBridalPartyRole({
			name: this.state.addNewRole.name,
			value: this.state.addNewRole.value,
		})
		.then(newRole => {
			this.state.roles.push(newRole);
			this.toggleNewRoleOptions(false);
		})
		.catch(e => alert('there was an error creating the new role'));
	}
	render() {
		return (
			<div>
				{!!this.state.addNewRole && (
					<div className="uk-margin-large-bottom">
						<header className="uk-margin">Create a role</header>
						<div className="new-bridalparty-role-form">
							<button
								onClick={() => this.toggleNewRoleOptions(false)}
								className="uk-button uk-button-default uk-button-small"
							>
								Cancel
							</button>
							<div>
								<input
									className="uk-input uk-form-small"
									type="text"
									placeholder="Name"
									value={this.state.addNewRole.name}
									onChange={e => this.setState({ addNewRole: {...this.state.addNewRole, name: e.target.value} })}
								/>
							</div>
							<div>
								<input
									className="uk-input uk-form-small"
									type="text"
									placeholder="value"
									value={this.state.addNewRole.value}
									onChange={e => this.setState({ addNewRole: {...this.state.addNewRole, value: e.target.value} })}
								/>
							</div>
							<button className="uk-button uk-button-primary uk-button-small" onClick={this.saveNewRole}>Save</button>
						</div>
					</div>
				)}
				<CheckboxTable
					data={this.state.roles}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					onDelete={this.onRolesDelete}
					buttons={
						this.state.addNewRole === null ?
							<button className="uk-button uk-button-primary uk-button-small" onClick={() => this.toggleNewRoleOptions(true)}>Add a new role</button> :
							null
					}
				/>
			</div>
		);
	}
}