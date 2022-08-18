function Modal({ onClose = () => {}, ...props }) {
	return (
		<div className="modal-container" onClick={onClose}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onClose();
				}}
				className="modal-close">
				&#10799;
			</button>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				{props.children}
			</div>
		</div>
	);
}

export default Modal;
