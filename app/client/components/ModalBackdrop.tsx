import './modalBackdrop.scss';

export default (props) => (
	<div className="modal-backdrop">
		{props.children}
	</div>
);
