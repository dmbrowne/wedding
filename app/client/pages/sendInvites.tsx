import * as React from 'react';
import Head from 'next/head';
import 'medium-draft/lib/index.css';
import { Editor, createEditorState } from 'medium-draft';
import { withAdmin } from '../components/adminLayout';
import withModal from '../components/withModal';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { sendAttendeeEmails } from '../api/email';

class SendInvites extends React.Component {
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

	state = {
		client: false,
		editorState: createEditorState(),
		subject: '',
	};

	onChange = (editorState) => {
		this.setState({ editorState });
	}

	componentDidMount() {
		this.setState({ client: true }, () => {
			this.editor.focus();
		});
	}

	send = () => {
		const { editorState } = this.state;
		const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		return sendAttendeeEmails({
			subject: this.state.subject,
			content: markup,
		});
	}

	renderShortCodes() {
		return (
			<div className="uk-section uk-section-muted uk-padding-small">
				<header>Short codes:</header>
				<div className="uk-grid uk-grid-large uk-margin-small-top">
					{this.shortCodes.map(type =>
						<div key={type.label} className="uk-width-1-2@s">
							<small>{type.label}</small>
							<form className="uk-form-horizontal">
								{type.codes.map(shortcode => (
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
					)}
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
						<section className="uk-container-small">
							<Editor
								ref={ref => this.editor = ref}
								editorState={editorState}
								onChange={this.onChange}
							/>
						</section>
					</React.Fragment>
				)}
				<div className="uk-clearfix uk-margin-large-top">
					<div className="uk-float-right">
						<button onClick={this.send} className="uk-button uk-button-primary uk-margin-right">Send to all attendees</button>
						<button className="uk-button uk-button-secondary">Send to all attendee groups</button>
					</div>
				</div>
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Invites' }, SendInvites),
);
