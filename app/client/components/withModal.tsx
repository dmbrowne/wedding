import * as React from 'react';

export default function modalHOC(Component) {
	return class ModalRootComponent extends React.Component {
		static async getInitialProps(props) {
			return (Component.getInitialProps ?
				Component.getInitialProps(props) :
				{}
			)
		}

		confirmModal = null;

		state = {
			confirmModalContent: {},
		};

		showConfirmModal = (options) => {
			return new Promise((resolve, reject) => {
				const modal = window.UIkit.modal(this.confirmModal)
				this.setState({
					confirmModalContent: {
						title: options.title,
						body: options.body,
						primaryText: options.primaryText,
						secondaryText: options.secondaryText,
						success: () => (modal.hide(), resolve()),
						cancel: () => (modal.hide(), reject()),
					}
				}, () => {
					modal.show()
				})
			})
		}

		render() {
			const { confirmModalContent } = this.state
			return (
				<div>
					<Component {...this.props} showConfirmModal={this.showConfirmModal} />
					<div className="uk-modal" ref={ref => this.confirmModal = ref}>
						<div className="uk-modal-dialog">
							<div className="uk-modal-header">
								<h2 className="uk-modal-title">{confirmModalContent.title}</h2>
							</div>
							<div className="uk-modal-body">{confirmModalContent.body}</div>
							<div className="uk-modal-footer uk-text-right">
								<button
									onClick={confirmModalContent.cancel}
									className="uk-button uk-button-default"
									type="button"
								>
									{confirmModalContent.secondaryText || 'No'}
								</button>
								<button
									onClick={confirmModalContent.success}
									className="uk-button uk-button-primary uk-margin-left"
									type="button"
								>
									{confirmModalContent.secondaryText || 'Yes'}
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		}
	};
}
