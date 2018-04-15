import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import CheckboxTable from '../components/CheckboxTable';
import { getBridalParties, deleteBridalParties } from "../api/bridalParty";
import BridalParty from '../../server/models/bridalParty';
import WeddingRolesScreen from '../components/WeddingRoles';

import Modal from '../components/Modal';
import { withAdmin } from '../components/adminLayout';

interface Props {
	bridalParties: BridalParty[];
}

interface State {
	weddingRolesModal: boolean;
}

class BridalParties extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => {
		return {
			bridalParties: res ?
				res.locals.bridalParties :
				await getBridalParties(),
		};
	}

	state = {
		weddingRolesModal: false,
	};

	renderHeader() {
		return (
			<tr>
				<th>First name</th>
				<th>Last name</th>
				<th>Role</th>
				<th>Sub-role</th>
				<th className="uk-table-shrink">VIP</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow(bridalPartyMember: BridalParty, onCheckboxTick, itemIsChecked) {
		console.log(bridalPartyMember);
		return (
			<tr key={bridalPartyMember.id}>
				<td>{bridalPartyMember.firstName}</td>
				<td>{bridalPartyMember.lastName}</td>
				<td>{!!bridalPartyMember.WeddingRole && bridalPartyMember.WeddingRole.name}</td>
				<td>{bridalPartyMember.subRole}</td>
				<td>{bridalPartyMember.vip.toString()}</td>
				<td>
					<Link prefetch={true} href={`/admin/bridalParties/${bridalPartyMember.id}`}>
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

	showWeddingRolesModal() {
		this.setState({
			weddingRolesModal: true,
		});
	}

	addNewMemberAndRoleButtons() {
		return (
			<React.Fragment>
				<button
					onClick={() => Router.push('/admin/bridalParties/new')}
					className="uk-button-small uk-float-left uk-button uk-button-primary"
				>
					Add
				</button>
				<button
					onClick={() => this.setState({ weddingRolesModal: true })}
					className="uk-button uk-button-small uk-button-secondary uk-margin-left"
				>
					Wedding Roles...
				</button>
			</React.Fragment>
		);
	}

	onPartyMemberDelete(ids) {
		deleteBridalParties(ids)
			.then(() => alert('successfully deleted.'))
			.catch(e => alert('Error deleting bridal party members'));
	}

	render() {
		return (
			<div className="uk-container">
				<h2>Everyone that you would like to come.</h2>
				<p className="uk-margin-large-bottom">No matter which events you would like them to attend, this list represents
					the total people you would like to attend throughout the day</p>
				<CheckboxTable
					data={this.props.bridalParties}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					onDelete={this.onPartyMemberDelete}
					buttons={this.addNewMemberAndRoleButtons()}
				/>
				{!!this.state.weddingRolesModal && (
					<Modal title="Wedding Roles" onClose={() => this.setState({ weddingRolesModal: false })}>
						<WeddingRolesScreen />
					</Modal>
				)}
			</div>
		);
	}
}

export default withAdmin({ title: 'Bridal Parties'}, BridalParties);

