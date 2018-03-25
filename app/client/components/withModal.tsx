import * as React from 'react';

interface ConfirmModalProps {
	title?: string;
	body?: string;
	primaryText?: string;
	secondaryText?: string;
}

interface ConfirmModalContent extends ConfirmModalProps {
	success?: () => any;
	cancel?: () => any;
}

interface State {
	confirmModalContent?: ConfirmModalContent;
}

export interface ChildProps {
	showConfirmModal: (options: ConfirmModalProps) => Promise<any>;
}

export default function modalHOC(Component) {
	return class ModalRootComponent extends React.Component<{}, State> {
		static async getInitialProps(props) {
			return Component.getInitialProps ? Component.getInitialProps(props) : {};
		}

		UIkit = undefined;
		confirmModal = null;

		state: State = {};

		showConfirmModal = (options: ConfirmModalProps) => {
			return new Promise((resolve, reject) => {
				const modal = this.UIkit.modal(this.confirmModal);
				this.setState({
					confirmModalContent: {
						...options,
						success: () => resolve(modal.hide()),
						cancel: () => reject(modal.hide()),
					},
				},
				() => modal.show());
			});
		}

		componentDidMount() {
			this.UIkit = require('uikit');
		}

		renderModal(content) {
			const {
				title,
				body,
				cancel,
				secondaryText = 'No',
				success,
				primaryText = 'Yes',
			} = content;
			return (
				<div className="uk-modal-dialog">
					<div className="uk-modal-header">
						{title && <h2 className="uk-modal-title">{title}</h2>}
					</div>
					{body && <div className="uk-modal-body">{body}</div>}
					<div className="uk-modal-footer uk-text-right">
						<button
							onClick={cancel ? cancel : null}
							className="uk-button uk-button-default"
						>
							{secondaryText}
						</button>
						<button
							onClick={success ? success : null}
							className="uk-button uk-button-primary uk-margin-left"
						>
							{primaryText}
						</button>
					</div>
				</div>
			);
		}
		render() {
			const { confirmModalContent } = this.state;

			return (
				<div>
					<Component {...this.props} showConfirmModal={this.showConfirmModal} />
					<div className="uk-modal" ref={ref => this.confirmModal = ref}>
						{confirmModalContent && this.renderModal(confirmModalContent)}
					</div>
				</div>
			);
		}
	};
}
