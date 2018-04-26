import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { getAllCampaigns, deleteCampaigns, createCampaign, sendCampaigns } from '../api/campaign';
import Campaign from '../../server/models/campaign';
import CheckboxTable from '../components/CheckboxTable';
import Modal from '../components/Modal';
import withModal, { ChildProps } from '../components/withModal';

interface State {
	campaigns: Campaign[];
	createNewCampaign: boolean;
	newCampaignType: 'group' | 'single';
	newCampaignName: string;
	selectedCampaignIds: {
		[campaignId: string]: boolean,
	};
}

interface Props extends ChildProps {
	campaigns: Campaign[];
}

class Campaigns extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => {
		return {
			campaigns: (res ?
				res.locals.campaigns :
				await getAllCampaigns()
			),
		};
	}

	state = {
		campaigns: [...this.props.campaigns],
		createNewCampaign: false,
		newCampaignType: null,
		newCampaignName: '',
		selectedCampaignIds: {},
	};

	closeCreateNewCampaignModal = () => {
		this.setState({
			createNewCampaign: false,
			newCampaignType: null,
			newCampaignName: '',
		});
	}

	openCreateNewCampaignModal = () => {
		this.setState({ createNewCampaign: true });
	}

	addCampaignModeTitle() {
		switch (this.state.newCampaignType) {
			case 'group':
				return 'Create an email campaign for sendGroups';
			case 'single':
				return 'Create an email campaign for single invitations';
			default:
				return 'Create an email campaign';
		}
	}

	renderHeader() {
		return (
			<tr>
				<th>Name</th>
				<th style={{width: 160, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow = (campaign, onCheckboxTick, itemIsChecked) => {
		const bulkModeIsActive = Object.keys(this.state.selectedCampaignIds).some(campaignId => {
			return this.state.selectedCampaignIds[campaignId] && this.state.selectedCampaignIds[campaignId] === true;
		});
		return (
			<tr key={`campaign-row-${campaign.id}`}>
				<td>{campaign.name}</td>
				<td>
					{!bulkModeIsActive && (
						<button
							onClick={() => this.sendCampaigns(campaign.id)}
							className="uk-button uk-button-small uk-button-primary"
						>
							Send invitations
						</button>
					)}
				</td>
				<td>
					<Link href={`/admin/campaigns/${campaign.id}`}>
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

	refreshList = async () => {
		try {
			const campaigns = await getAllCampaigns();
			this.setState({ campaigns });
		} catch (e) {
			console.log(e);
			alert('There was an error refreshing the list. Try manually refreshing');
		}
	}

	onDelete = (ids) => {
		deleteCampaigns(ids)
			.then(() => {
				const optimisticUpdatedAttendees = this.state.campaigns.filter(({id}) => ids.indexOf(id) < 0);
				this.setState(
					{ campaigns: optimisticUpdatedAttendees },
					() => this.refreshList(),
				);
			})
			.catch(e => {
				console.log(e)
				alert('Something went wrong with the deletion, try again later');
			});
	}

	createCampaign = () => {
		createCampaign({
			name: this.state.newCampaignName,
			groupCampaign: this.state.newCampaignType === 'group',
		})
		.then(newCampaign => {
			Router.push(`/admin/campaigns/${newCampaign.id}`);
		})
		.catch(e => alert('There was an error creating the campaign'));
	}

	onCheckboxSelect = (data) => {
		this.setState({
			selectedCampaignIds: { ...data }
		});
	}

	sendCampaigns = (campaignId?: string) => {
		const campaignIds = !campaignId ?
			Object.keys(this.state.selectedCampaignIds).filter(cmpgnId => this.state.selectedCampaignIds[cmpgnId]) :
			[campaignId];

		if (campaignIds.length > 0) {
			this.props.showConfirmModal({
				title: 'Please confirm',
				body: 'You are about to send out invites to the attendee(s) / group(s) selected. Press yes below to proceed, or cancel to return back to the previous screen',
				primaryText: 'Yes',
				secondaryText: 'Cancel',
			})
			.then(() => sendCampaigns(campaignIds))
			.catch(() => void 0);
		} else {
			return null;
		}
	}

	render() {
		return (
			<div className="uk-container">
				<h2>Everyone that you would like to come.</h2>
				<p className="uk-margin-large-bottom">No matter which events you would like them to attend, this list represents
					the total people you would like to attend throughout the day</p>
				<CheckboxTable
					data={this.state.campaigns}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					onDelete={this.onDelete}
					onSelect={this.onCheckboxSelect}
					buttons={(
						<button
							onClick={this.openCreateNewCampaignModal}
							className="uk-button-small uk-float-left uk-button uk-button-primary"
						>
							Add
						</button>
					)}
					bulkButtons={(
						<button
							onClick={() => this.sendCampaigns()}
							className="uk-button-small uk-float-left uk-button uk-button-primary"
						>
							Send invites
						</button>
					)}
				/>
				{this.state.createNewCampaign && (
					<Modal
						onClose={this.closeCreateNewCampaignModal}
						goBack={!!this.state.newCampaignType ? () => this.setState({ newCampaignType: null}) : null}
						title={this.addCampaignModeTitle()}
					>
						{!this.state.newCampaignType && (
							<React.Fragment>
								<header className="uk-text-center">What type of email campaign would you like to create?</header>
								<div className="uk-margin upload-buttons uk-text-center">
									<button
										onClick={() => this.setState({ newCampaignType: 'group' })}
										className="uk-button uk-button-primary uk-margin-small-left uk-margin-small-right"
									>
										Grouped invitations
									</button>
									<button
										onClick={() => this.setState({ newCampaignType: 'single' })}
										className="uk-button uk-button-primary uk-margin-small-left uk-margin-small-right"
									>
										Single invitations
									</button>
								</div>
							</React.Fragment>
						)}
						{!!this.state.newCampaignType && (
							<div className="uk-form-stacked">
								<div className="uk-margin">
									<label className="uk-form-label">Enter a name for your campaign</label>
									<input
										type="text"
										className="uk-input"
										value={this.state.newCampaignName}
										onChange={e => this.setState({ newCampaignName: e.target.value })}
									/>
								</div>
								<div className="uk-margin uk-text-center">
									<button onClick={this.createCampaign} className="uk-button uk-button-primary">Create</button>
								</div>
							</div>
						)}
					</Modal>
				)}
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Campaigns'}, Campaigns),
);
