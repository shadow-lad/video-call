function Modal({ onClose = () => {}, ...props }) {
	return (
		<div className="modal-container">
			<button onClick={onClose} className="modal-close">
				&#10799;
			</button>
			<div className="modal">{props.children}</div>
		</div>
	);
}

export default Modal;
