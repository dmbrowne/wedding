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
	// selectedAttendeeMap: attendeeMap;
	selectedAttendeeList: Array<Attendee['id']>;
	attendeesSearchList: {
		[attendeeId: string]: Attendee;
	};
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
		const { map: attendeesSearchList, list: selectedAttendeeList } = attendeesOrGroups.reduce(
			(accum, attendeeOrSendGroup) => ({
				list: [...accum.list, attendeeOrSendGroup.id],
				map: {
					...accum.map,
					[attendeeOrSendGroup.id]: attendeeOrSendGroup,
				},
			}),
			{ list: [], map: {} }
		);

		this.state = {
			client: false,
			editorState,
			campaignName: campaign.name,
			subject: campaign.subject || '',
			selectedAttendeeList,
			attendeesSearchList,
			addAttendeesModal: false,
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
		const emailable = true;
		const attendees = this.props.campaign.groupCampaign ?
			await getSendGroups() :
			await getAllAttendees(emailable);
		this.setState({ attendeesSearchList: arrayToObject(attendees, 'id') });
	}

	openModal = () => {
		this.setState({ addAttendeesModal: true });
		this.getAttendees();
	}

	closeModal = () => {
		this.setState({ addAttendeesModal: false });
	}

	isGroupCampaign(attendeeOrGroup: Attendee | SendGroup, isGroup?: boolean): attendeeOrGroup is SendGroup {
		if (isGroup !== undefined) {
			if (isGroup) {
				return true;
			}
			return false;
		} else {
			return !!(attendeeOrGroup as SendGroup).name;
		}
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

	renderAttendeeOrGroupSearchListRow(attendeeOrGroup) {
		if (this.props.campaign.groupCampaign) {
			return this.renderSendGroupSearchListRow(attendeeOrGroup);
		} else {
			return this.renderAttendeeSearchListRow(attendeeOrGroup);
		}
	}

	renderAttendeeSearchListRow(attendee) {
		return (
			<li
				key={attendee.id}
				className="uk-clearfix"
				onClick={() => this.toggleSelectedGroupOrAttendee(attendee)}
			>
				<span>
					{`${attendee.firstName} ${attendee.lastName}`}
				</span>
				{this.state.selectedAttendeeList.indexOf(attendee.id) >= 0 && (
					<i className="material-icons uk-float-right">check</i>
				)}
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
						const label = this.isGroupCampaign(attendeeOrGroup) ?
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
						<ul
							className={cx({
								'uk-list': !groupCampaign,
								'uk-list-striped': !groupCampaign,
								'uk-description-list': groupCampaign,
								'uk-description-list-divider': groupCampaign,
							})}
						>
							{Object.keys(attendeesSearchList).length >= 0 && Object.keys(attendeesSearchList).map(attendeeOrCampaignId => {
								const attendeeOrCampaign = attendeesSearchList[attendeeOrCampaignId];
								return this.renderAttendeeOrGroupSearchListRow(attendeeOrCampaign);
							})}
						</ul>
					</Modal>
				)}
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Invites' }, SendInvites),
);
