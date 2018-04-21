import * as React from 'react';
import Head from 'next/head';
import 'medium-draft/lib/index.css';
import { Editor, createEditorState } from 'medium-draft';
import { withAdmin } from '../components/adminLayout';
import withModal from '../components/withModal';
import { convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import { sendAttendeeEmails } from '../api/email';
import { getCampaign, editCampaign } from '../api/campaign';
import { getAllAttendees } from '../api/attendee';
import { getSendGroups } from '../api/sendGroup';
import ModalBackdrop from '../components/ModalBackdrop';

class SendInvites extends React.Component {
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

		let attendeeList = [];
		let attendeeMap = {};
		const attendees = campaign.groupCampaign ? campaign.SendGroups : campaign.Attendees;
		if (Array.isArray(attendees)) {
			const initialReduce = {
				attendeeList: [],
				attendeeMap: {},
			};
			const { attendeeList: list, attendeeMap: map } = attendees.reduce((accum, attendee) => ({
				attendeeList: [
					...accum.attendeeList,
					attendee.id,
				],
				attendeeMap: {
					...accum.attendeeMap,
					[attendee.id]: attendee,
				},
			}), initialReduce);
			attendeeList = list; attendeeMap = map;
		}

		this.state = {
			client: false,
			editorState,
			campaignName: campaign.name,
			subject: campaign.subject || '',
			selectedAttendeeMap: attendeeMap,
			selectedAttendeeList: attendeeList,
			attendeesSearchList: [],
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
		this.setState({ attendeesSearchList: attendees });
	}

	openModal = () => {
		this.setState({ addAttendeesModal: true });
		this.getAttendees();
	}

	closeModal = () => {
		this.setState({ addAttendeesModal: false });
	}

	addAttendeeToSelectedList = (attendee) => {
		if (this.state.selectedAttendeeMap[attendee.id]) {
			return;
		}

		this.setState({
			selectedAttendeeList: [
				...this.state.selectedAttendeeList,
				attendee.id,
			],
			selectedAttendeeMap: {
				...this.state.selectedAttendeeMap,
				[attendee.id]: attendee,
			},
		});
	}

	removeAttendeeFromSelectedList = (attendee) => {
		const { selectedAttendeeMap, selectedAttendeeList } = { ...this.state };
		delete selectedAttendeeMap[attendee.id];
		selectedAttendeeList.splice(selectedAttendeeList.indexOf(attendee.id), 1);
		this.setState({
			selectedAttendeeMap,
			selectedAttendeeList,
		});
	}

	renderAttendeeSearchListRow(attendeeOrGroup) {
		const { groupCampaign } = this.props.campaign;
		return (
			<li
				key={attendeeOrGroup.id}
				className="uk-clearfix"
				onClick={() => this.addAttendeeToSelectedList(attendeeOrGroup)}
			>
				<span>
					{groupCampaign ?
						attendeeOrGroup.name :
						`${attendeeOrGroup.firstName} ${attendeeOrGroup.lastName}`
					}
				</span>
				{this.state.selectedAttendeeList.indexOf(attendeeOrGroup.id) >= 0 && (
					<i className="material-icons uk-float-right">check</i>
				)}
			</li>
		);
	}

	renderSelectedAttendees() {
		const { groupCampaign } = this.props.campaign;
		return (
			this.state.selectedAttendeeList.length > 0 && (
				<ul className="uk-list uk-list-divider">
					{this.state.selectedAttendeeList.map(attendeeId => {
						const attendeeOrGroup = this.state.selectedAttendeeMap[attendeeId];
						return (
							<li key={attendeeOrGroup.id}>
								{groupCampaign ?
									attendeeOrGroup.name :
									`${attendeeOrGroup.firstName} ${attendeeOrGroup.lastName}`
								}
							</li>
						);
					})}
				</ul>
			)
		);
	}

	render() {
		const { editorState } = this.state;
		return (
			<div className="uk-container">
				<Head>
					<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
				</Head>
				<div className="uk-margin-large">
					<label>Campaign name</label>
					<input
						type="text"
						className="uk-input uk-form-large"
						value={this.state.campaignName}
						onChange={e => this.setState({ campaignName: e.target.value })}
					/>
				</div>
				{this.state.client && (
					<React.Fragment>
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
					</React.Fragment>
				)}
				<div className="uk-margin-large">
					{this.renderSelectedAttendees()}
					<button
						onClick={this.openModal}
						className="uk-button uk-button-secondary uk-margin-right"
					>
						Add / remove attendees
					</button>
				</div>
				<div className="uk-text-right uk-margin">
					<button onClick={this.save} className="uk-button uk-button-primary uk-margin-right">Save</button>
				</div>
				<div />
				{!!this.state.addAttendeesModal && (
					<ModalBackdrop>
						<div className="uk-custom-modal">
							<header className="uk-modal-header">
								<h2 className="uk-modal-title">Add / remove attendees</h2>
							</header>
							<div className="uk-modal-body">
								<ul className="uk-list uk-list-divider">
									{this.state.attendeesSearchList.map(attendee => this.renderAttendeeSearchListRow(attendee))}
								</ul>
							</div>
							<footer className="uk-modal-footer uk-text-right">
								<button onClick={this.closeModal} className="uk-button uk-button-secondary">Close</button>
							</footer>
						</div>
					</ModalBackdrop>
				)}
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Invites' }, SendInvites),
);
