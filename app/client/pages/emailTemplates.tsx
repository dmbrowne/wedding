import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { getAll as getAllEmailTemplates, create as createNewEmailTemplate } from '../api/emailTemplates';
import CheckboxTable from '../components/CheckboxTable';
import Modal from '../components/Modal';
import withModal, { ChildProps } from '../components/withModal';


class EmailTemplatesPage extends React.Component {
	static getInitialProps = async ({ res }) => {
		const emailTemplates = !!res ? res.locals.emailTemplates : await getAllEmailTemplates();
		return { emailTemplates };
	}

	state = {
		createNew: false,
		newEmailTemplateName: '',
	};

	renderHeader() {
		return (
			<tr>
				<th>Name</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow = (emailTemplate) => {
		return (
			<tr key={`user-row-${emailTemplate.id}`}>
				<td>{emailTemplate.name}</td>
				<td>
					<Link
						prefetch={true}
						href={`/editEmailTemplate?emailTemplateId=${emailTemplate.id}`}
						as={`/admin/emailTemplates/${emailTemplate.id}`}
					>
						<i className="material-icons">mode_edit</i>
					</Link>
				</td>
			</tr>
		);
	}

	createEmailTemplate = () => {
		createNewEmailTemplate({
			name: this.state.newEmailTemplateName,
		})
		.then(newEmailTemplate => {
			Router.push('/emailtemplates', `/admin/emailtemplates/${newEmailTemplate.id}`, {
				query: { emailTemplateId: newEmailTemplate.id },
			});
		});
	}

	render() {
		return (
			<div className="uk-container">
				<h2>Email templates</h2>
				<p className="uk-margin-large-bottom">
					Email templates to be used within campaigns
				</p>
				<CheckboxTable
					data={this.props.emailTemplates}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					buttons={(
						<button
							onClick={() => this.setState({ createNew: true })}
							className="uk-button-small uk-float-left uk-button uk-button-primary"
						>
							Add
						</button>
					)}
				/>
				{this.state.createNew &&
					<Modal
						onClose={() => this.setState({ createNew: false })}
						title="New email template"
					>
						<div className="uk-form-stacked">
							<div className="uk-margin">
								<label className="uk-form-label">Enter a name for the template</label>
								<input
									type="text"
									className="uk-input"
									value={this.state.newEmailTemplateName}
									onChange={e => this.setState({ newEmailTemplateName: e.target.value })}
								/>
							</div>
							<div className="uk-margin uk-text-center">
								<button onClick={this.createEmailTemplate} className="uk-button uk-button-primary">Create</button>
							</div>
						</div>
					</Modal>
				}
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Email templates'}, EmailTemplatesPage),
);
