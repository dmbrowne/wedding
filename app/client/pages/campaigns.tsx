import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { getAllCampaigns, deleteCampaigns, createCampaign, sendCampaigns } from '../api/campaign';
import Campaign from '../../server/models/campaign';
import CheckboxTable from '../components/CheckboxTable';
import ModalBackdrop from '../components/ModalBackdrop';

interface State {
	campaigns: Campaign[];
	createNewCampaign: boolean;
	newCampaignType: 'group' | 'single';
	newCampaignName: string;
	selectedCampaignIds: {
		[campaignId: string]: boolean,
	};
}

class Campaigns extends React.Component<{ campaigns: Campaign[] }, State> {
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
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow(campaign, onCheckboxTick, itemIsChecked) {
		return (
			<tr key={`campaign-row-${campaign.id}`}>
				<td>{campaign.name}</td>
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

	sendCampaigns = () => {
		const campaignIds = Object.keys(this.state.selectedCampaignIds).filter(campaignId => this.state.selectedCampaignIds[campaignId]);
		if (campaignIds.length > 0) {
			console.log(campaignIds)
			return sendCampaigns(campaignIds);
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
							onClick={this.sendCampaigns}
							className="uk-button-small uk-float-left uk-button uk-button-primary"
						>
							Send invites
						</button>
					)}
				/>
				{this.state.createNewCampaign && (
					<ModalBackdrop>
						<div className="uk-custom-modal">
							<i onClick={this.closeCreateNewCampaignModal} className="close material-icons">close</i>
							<header className="uk-modal-header">
								{!!this.state.newCampaignType && (
									<i
										onClick={() => this.setState({ newCampaignType: null})}
										className="material-icons"
									>
										arrow_back
									</i>
								)}
								<h2 className="uk-modal-title">{this.addCampaignModeTitle()}</h2>
							</header>
							<div className="uk-modal-body">
								{!this.state.newCampaignType && (
									<React.Fragment>
										<header className="uk-text-center">What type of email campaign would you like to create?</header>
										<div className="uk-margin upload-buttons">
											<button
												onClick={() => this.setState({ newCampaignType: 'group' })}
												className="uk-button uk-button-primary"
											>
												Grouped invitations
											</button>
											<button
												onClick={() => this.setState({ newCampaignType: 'single' })}
												className="uk-button uk-button-primary"
											>
												Single invitations
											</button>
										</div>
									</React.Fragment>
								)}
								{!!this.state.newCampaignType && (
									<React.Fragment>
										<div className="uk-margin">
											<label>Enter a name for your campaign</label>
											<input
												type="text"
												value={this.state.newCampaignName}
												onChange={e => this.setState({ newCampaignName: e.target.value })}
											/>
										</div>
										<div className="uk-margin uk-text-center">
											<button onClick={this.createCampaign} className="uk-button uk-button-primary">Create</button>
										</div>
									</React.Fragment>
								)}
							</div>
						</div>
					</ModalBackdrop>
				)}
			</div>
		);
	}
}

export default withAdmin({ title: 'Campaigns'}, Campaigns);
