import './modal.scss';
import * as React from 'react';
import ModalBackdrop from './ModalBackdrop';

interface Props {
	onClose?: () => any;
	goBack?: () => any;
	title: string;
	footer?: React.ReactNode;
}

export default class Modal extends React.Component<Props> {
	render() {
		const { onClose, goBack, title, children, footer } = this.props;
		return (
			<ModalBackdrop>
				<div className="yd-custom-modal">
					{!!onClose && <i onClick={onClose} className="close material-icons">close</i>}
					<header className="uk-modal-header">
						{!!goBack && <i onClick={goBack} className="material-icons">arrow_back</i>}
						<h2 className="uk-modal-title">{title}</h2>
					</header>
					<div className="uk-modal-body">
						{children}
					</div>
				</div>
				{!!footer && (
					<div className="uk-modal-footer">
					{footer}
				</div>
				)}
			</ModalBackdrop>
		);
	}
}
