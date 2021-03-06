import * as React from 'react';
import Head from 'next/head';
import 'medium-draft/lib/index.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor, createEditorState } from 'medium-draft';
import { withAdmin } from '../components/adminLayout';
import withModal from '../components/withModal';
import Attendee from '../../server/models/attendee';
import Campaign from '../../server/models/campaign';
import cx from 'classnames';
import { getCampaign, editCampaign } from '../api/campaign';
import { getAllAttendees } from '../api/attendee';
import { getSendGroups } from '../api/sendGroup';
import Modal from '../components/Modal';
import { arrayToObject } from '../../server/utils';
import SendGroup from '../../server/models/sendGroup';

interface State {
	client: boolean;
	editorState: EditorState;
	campaignName: string;
	subject: string;
	addAttendeesModal: boolean;
	hideGroupedAttendees: boolean;
	selectedAttendeeList: Array<Attendee['id']>;
	attendeesSearchList: {
		[attendeeId: string]: Attendee;
	};
	filterSearchTerms: string;
}

interface Props {
	campaign: Campaign;
}

class SendInvites extends React.Component<Props, State> {
	static getInitialProps = async ({ res, query }) => {
		return {
			campaign: (res ?
				res.locals.campaign :
				await getCampaign(query.campaignId)
			),
		};
	}

	editor = null;

	shortCodes = [
		{
			label: 'Sending to attendees...',
			codes: [
				{
					label: 'Y & D logo',
					code: '%logo%',
				},
				{
					label: 'First name',
					code: '%recipient.first%',
				},
				{
					label: 'Last name',
					code: '%recipient.last%',
				},
				{
					label: 'Invitation link',
					code: '%recipient.invitationlink%',
				},
			],
		},
		{
			label: 'Sending to attendee groups...',
			codes: [
				{
					label: 'Y & D logo',
					code: '%logo%',
				},
				{
					label: 'Group name',
					code: '%recipient.name%',
				},
				{
					label: 'Invitation link',
					code: '%recipient.invitationlink%',
				},
			],
		},
	];

	constructor(props) {
		super(props);
		const { campaign } = this.props;
		const editorState = campaign.content ?
			createEditorState(JSON.parse(campaign.content)) :
			createEditorState();

		const attendeesOrGroups = campaign.groupCampaign ? campaign.SendGroups : campaign.Attendees;
		const campaignRecipients = attendeesOrGroups.reduce((accum, attendeeOrSendGroup: Attendee | SendGroup) => ({
			list: [...accum.list, attendeeOrSendGroup.id],
			map: {
				...accum.map,
				[attendeeOrSendGroup.id]: attendeeOrSendGroup,
			},
		}), { list: [], map: {} });

		this.state = {
			client: false,
			editorState,
			campaignName: campaign.name,
			subject: campaign.subject || '',
			selectedAttendeeList: campaignRecipients.list,
			attendeesSearchList: campaignRecipients.map,
			addAttendeesModal: false,
			hideGroupedAttendees: true,
			filterSearchTerms: '',
		};
	}

	onChange = (editorState) => {
		this.setState({ editorState });
	}

	componentDidMount() {
		this.setState({ client: true }, () => {
			this.editor.focus();
		});
	}

	save = () => {
		const { editorState, subject, campaignName, selectedAttendeeList } = this.state;
		const recipientKey = this.props.campaign.groupCampaign ? 'sendGroupIds' : 'attendeeIds';
		editCampaign(this.props.campaign.id, {
			content: convertToRaw(editorState.getCurrentContent()),
			subject,
			name: campaignName,
		}, {
			[recipientKey]: selectedAttendeeList,
		})
		.then(() => alert('saved'))
		.catch(e => alert(`Error saving: ${e.message}`));
	}

	getShortCodes() {
		return this.props.campaign.groupCampaign ? this.shortCodes[1] : this.shortCodes[0];
	}

	renderShortCodes() {
		return (
			<div className="uk-section uk-section-muted uk-padding-small">
				<header>Short codes:</header>
				<div className="uk-margin-small-top">
					<form className="uk-form-horizontal">
						{this.getShortCodes().codes.map(shortcode => (
							<div key={shortcode.label} className="uk-margin-small">
								<label className="uk-form-label">{shortcode.label}</label>
								<div className="uk-form-controls">
									<input
										disabled={true}
										type="text"
										className="uk-form-small uk-input"
										value={shortcode.code}
									/>
								</div>
							</div>
						))}
					</form>
				</div>
			</div>
		);
	}

	getAttendees = async () =>  {
		const campaignIsGroupCampaign = this.props.campaign.groupCampaign;
		const attendees = campaignIsGroupCampaign ?
			await getSendGroups() :
			await getAllAttendees();
		this.setState({ attendeesSearchList: arrayToObject(attendees, 'id') });
	}

	openModal = () => {
		this.setState({ addAttendeesModal: true });
		this.getAttendees();
	}

	closeModal = () => {
		this.setState({ addAttendeesModal: false });
	}

	isSendGroup(attendeeOrGroup: Attendee | SendGroup) {
		if ((attendeeOrGroup as Attendee).firstName) {
			return false;
		}
		return true;
	}

	toggleSelectedGroupOrAttendee(attendeeOrGroup: Attendee | SendGroup) {
		if (this.state.selectedAttendeeList.indexOf(attendeeOrGroup.id) >= 0) {
			this.removeAttendeeFromSelectedList(attendeeOrGroup);
		} else {
			this.addAttendeeToSelectedList(attendeeOrGroup);
		}
	}

	selectAll = () => {
		this.setState({
			selectedAttendeeList: Object.keys(this.state.attendeesSearchList),
		});
	}

	deSelectAll = () => {
		this.setState({
			selectedAttendeeList: [],
		});
	}

	addAttendeeToSelectedList = (attendee) => {
		this.setState({
			selectedAttendeeList: [
				...this.state.selectedAttendeeList,
				attendee.id,
			],
		});
	}

	removeAttendeeFromSelectedList = (attendee) => {
		const { selectedAttendeeList } = { ...this.state };
		selectedAttendeeList.splice(selectedAttendeeList.indexOf(attendee.id), 1);
		this.setState({
			selectedAttendeeList,
		});
	}

	filteredItems(modalAttendeeIds?) {
		const  { attendeesSearchList } = this.state;
		modalAttendeeIds = modalAttendeeIds ? modalAttendeeIds : Object.keys(attendeesSearchList);
		return modalAttendeeIds.filter(attendeeOrSendGroupId => {
			const attendeeOrSendGroup = attendeesSearchList[attendeeOrSendGroupId];
			const searchField = Object.keys(attendeeOrSendGroup)
				.filter(key => typeof attendeeOrSendGroup[key] === 'string')
				.map(key => attendeeOrSendGroup[key].toLowerCase())
				.join(' ').trim();

			return !!this.state.filterSearchTerms ?
				searchField.indexOf(this.state.filterSearchTerms) >= 0 :
				true;
		});
	}

	renderModalAttendeeList() {
		const { groupCampaign } = this.props.campaign;
		const  { attendeesSearchList } = this.state;

		const attendeeIds = this.filteredItems(
			(this.state.hideGroupedAttendees && !groupCampaign ?
				Object.keys(attendeesSearchList).filter(attendeeId => !attendeesSearchList[attendeeId].sendGroupId) :
				Object.keys(attendeesSearchList)
			),
		);

		return (
			<ul
				className={cx({
					'uk-list': !groupCampaign,
					'uk-list-striped': !groupCampaign,
					'uk-description-list': groupCampaign,
					'uk-description-list-divider': groupCampaign,
				})}
			>
				{attendeeIds.length >= 0 && attendeeIds.map(attendeeOrSendGroupId => {
					const attendeeOrSendGroup = attendeesSearchList[attendeeOrSendGroupId];
					if (this.props.campaign.groupCampaign) {
						return this.renderSendGroupSearchListRow(attendeeOrSendGroup);
					} else {
						return this.renderAttendeeSearchListRow(attendeeOrSendGroup);
					}
				})}
			</ul>
		);
	}

	renderAttendeeSearchListRow(attendee) {
		const disabled = !attendee.email;
		const removeDisabledAttendee = this.state.selectedAttendeeList.indexOf(attendee.id) > -1 ?
			this.removeAttendeeFromSelectedList :
			null;

		const onClick = () => disabled ?
			removeDisabledAttendee(attendee) :
			this.toggleSelectedGroupOrAttendee(attendee);

		return (
			<li
				key={attendee.id}
				className={`uk-clearfix${disabled ? ' uk-text-muted' : ''}`}
				onClick={onClick}
			>
				<span>
					{`${attendee.firstName} ${attendee.lastName}`}
				</span>
				{this.state.selectedAttendeeList.indexOf(attendee.id) >= 0 && (
					<i className="material-icons uk-float-right">check</i>
				)}
				{disabled && <small style={{display: 'block'}}>Disabled because attendee does not have an email address</small>}
			</li>
		);
	}

	renderSendGroupSearchListRow(sendGroup) {
		return (
			<React.Fragment key={sendGroup.id}>
				<dt className="uk-clearfix" onClick={() => this.toggleSelectedGroupOrAttendee(sendGroup)}>
					<span className="uk-float-left">{sendGroup.name}</span>
					{this.state.selectedAttendeeList.indexOf(sendGroup.id) >= 0 && (
						<i className="material-icons uk-float-right">check</i>
					)}
				</dt>
				<dd>{sendGroup.Attendees.map(attendee => attendee.firstName).join(', ')}</dd>
			</React.Fragment>
		);
	}

	renderSelectedAttendees() {
		return (
			this.state.selectedAttendeeList.length > 0 && (
				<ul className="uk-list uk-list-divider">
					{this.state.selectedAttendeeList.map(attendeeId => {
						const attendeeOrGroup: Attendee | SendGroup = this.state.attendeesSearchList[attendeeId];
						const label = this.isSendGroup(attendeeOrGroup) ?
							attendeeOrGroup.name :
							`${attendeeOrGroup.firstName} ${attendeeOrGroup.lastName}`;

						return (
							<li key={attendeeOrGroup.id}>{label}</li>
						);
					})}
				</ul>
			)
		);
	}

	render() {
		const { editorState, attendeesSearchList } = this.state;
		const { groupCampaign } = this.props.campaign;
		return (
			<div className="uk-container">
				<Head>
					<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
				</Head>
				<input
					type="text"
					className="uk-input uk-form-large"
					value={this.state.campaignName}
					onChange={e => this.setState({ campaignName: e.target.value })}
				/>
				{this.state.client && (
					<div className="uk-section uk-section-small">
						<h3 className="uk-margin-small">Email Content</h3>
						{this.renderShortCodes()}
						<div className="uk-margin-top">
							<div className="uk-text-meta uk-text-primary uk-margin-small">
								Use shortcodes to replace values with real content
							</div>
							<input
								type="text"
								className="uk-input"
								value={this.state.subject}
								placeholder="Email subject..."
								onChange={e => this.setState({ subject: e.target.value })}
							/>
							<small className="uk-margin-small-left uk-text-muted">e.g. Hello %recipient.first%</small>
						</div>
						<section className="uk-container-small uk-placeholder">
							<Editor
								ref={ref => this.editor = ref}
								editorState={editorState}
								onChange={this.onChange}
							/>
						</section>
					</div>
				)}
				<div className="uk-section uk-section-small">
					<h3 className="uk-margin-small">Recipients</h3>
					{this.renderSelectedAttendees()}
					<button
						onClick={this.openModal}
						className="uk-button uk-button-secondary uk-margin"
					>
						Add / remove {groupCampaign ? 'send groups' : 'attendees'}
					</button>
				</div>
				<div className="uk-text-right uk-margin">
					<button onClick={this.save} className="uk-button uk-button-primary uk-margin-right">Save</button>
				</div>
				<div />
				{!!this.state.addAttendeesModal && (
					<Modal
						title={`Add / remove ${groupCampaign ? 'send groups' : 'attendees'}`}
						footer={(
							<div className="uk-clearfix">
								<div className="uk-button-group uk-float-left">
									<button
										onClick={this.selectAll}
										className="uk-button uk-button-secondary uk-margin-small-right"
									>
										Select all
									</button>
									<button
										onClick={this.deSelectAll}
										className="uk-button uk-button-secondary"
									>
										Unselect all
									</button>
								</div>
								<button onClick={this.closeModal} className="uk-button uk-button-secondary uk-float-right">Close</button>
							</div>
						)}
					>
						{!groupCampaign &&
							<div>
								<input
									type="checkbox"
									checked={this.state.hideGroupedAttendees}
									onChange={e => this.setState({ hideGroupedAttendees: e.target.checked})}
								/>{' '}
								<label>Hide attendees that are in a send group</label>
							</div>
						}
						<div className="uk-margin-bottom">
							<input
								type="text"
								value={this.state.filterSearchTerms}
								className="uk-input"
								onChange={e => this.setState({ filterSearchTerms: e.target.value})}
							/>
						</div>
						{this.renderModalAttendeeList()}
					</Modal>
				)}
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Invites' }, SendInvites),
);
