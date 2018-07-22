import * as React from 'react';
import Head from 'next/head';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor, createEditorState } from 'medium-draft';
import 'medium-draft/lib/index.css';
import { withAdmin } from '../components/adminLayout';
import { getById as getEmailTemplateById, update as updateEmailTemplate } from '../api/emailTemplates';

interface IState {
	client: boolean;
	editorState: EditorState;
	emailTemplateName: string;
}

interface IProps {
}

class EmailTemplateEdit extends React.Component<IProps, IState> {
	static getInitialProps = async ({ res, query }) => {
		return {
			emailTemplate: (res ?
				res.locals.emailTemplate :
				await getEmailTemplateById(query.emailTemplateId)
			),
		};
	}

	editor = React.createRef();

	constructor(props: IProps) {
		super(props);
		console.log(props)
		this.state = {
			client: false,
			emailTemplateName: props.emailTemplate.name,
			editorState: props.emailTemplate.draftContentState ?
				createEditorState(JSON.parse(props.emailTemplate.draftContentState)) :
				createEditorState(),
		};
	}

	componentDidMount() {
		this.setState({ client: true }, () => {
			this.editor.focus();
		});
	}

	save = () => {
		const { editorState, emailTemplateName } = this.state;
		updateEmailTemplate(this.props.emailTemplate.id, {
			name: emailTemplateName,
			draftContentState: convertToRaw(editorState.getCurrentContent()),
		})
		.then(() => alert('saved'))
		.catch(e => alert(`Error saving: ${e.message}`));
	}

	render() {
		return (
			<div className="uk-container">
				<Head>
					<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
				</Head>
				<input
					type="text"
					className="uk-input uk-form-large"
					value={this.state.emailTemplateName}
					onChange={e => this.setState({ emailTemplateName: e.target.value })}
				/>
				{this.state.client &&
					<div className="uk-section uk-section-small">
						<section className="uk-container-small uk-placeholder">
							<Editor
								ref={ref => this.editor = ref}
								editorState={this.state.editorState}
								onChange={editorState => this.setState({ editorState })}
							/>
						</section>
						<div className="uk-text-right uk-margin">
							<button onClick={this.save} className="uk-button uk-button-primary">Save</button>
						</div>
					</div>
				}
			</div>
		);
	}
}

export default withAdmin({ title: 'Edit email templates'}, EmailTemplateEdit);
