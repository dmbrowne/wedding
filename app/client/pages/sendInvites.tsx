import * as React from 'react';
import Head from 'next/head';
import 'medium-draft/lib/index.css';
import { Editor, createEditorState } from 'medium-draft';
import { withAdmin } from '../components/adminLayout';
import withModal from '../components/withModal';

class SendInvites extends React.Component {
	editor = null;

	state = {
		client: false,
		editorState: createEditorState(),
	};

	onChange = (editorState) => {
		this.setState({ editorState });
	}

	componentDidMount() {
		this.setState({ client: true }, () => {
			this.editor.focus();
		});
	}

	render() {
		const { editorState } = this.state;
		return (
			<div className="uk-container">
				<Head>
					<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
				</Head>
				{this.state.client && (
					<section className="uk-container-small">
						<Editor
							ref={ref => this.editor = ref}
							editorState={editorState}
							onChange={this.onChange}
						/>
					</section>
				)}
				<div className="uk-clearfix uk-margin-large-top">
					<div className="uk-float-right">
						<button className="uk-button uk-button-primary uk-margin-right">Send to all attendees</button>
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
