import * as React from 'react';
import Head from 'next/head';
import 'medium-draft/lib/index.css';
import { Editor, createEditorState } from 'medium-draft';
import { withAdmin } from '../components/adminLayout';
import withModal from '../components/withModal';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { sendAttendeeEmails } from '../api/email';
import { getCampaign } from '../api/campaign';

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
			createEditorState(campaign.content) :
			createEditorState();
		this.state = {
			client: false,
			editorState,
			campaignName: campaign.name,
			subject: '',
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
		const { editorState, subject, campaignName } = this.state;
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
	render() {
		const { editorState } = this.state;
		return (
			<div className="uk-container">
				<Head>
					<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
				</Head>
				<div className="uk-margin-large">
					<label>Campaign name</label>
					<input type="text" className="uk-input uk-form-large" value={this.state.campaignName} />
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
				<div className="uk-text-right uk-margin">
					<button onClick={this.save} className="uk-button uk-button-primary uk-margin-right">Save</button>
				</div>
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Invites' }, SendInvites),
);
