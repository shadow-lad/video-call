import { useEffect, useRef } from "react";

function Video({ stream, volume, ...props }) {
	const ref = useRef();

	useEffect(() => {
		if (!ref.current || !stream) return;

		ref.current.srcObject = stream;
		ref.current.volume = volume ?? 1.0;
	}, [stream, volume]);

	const isMyVideo = props.id === "my-video";

	return (
		<video
			ref={ref}
			style={
				isMyVideo
					? {
							width: "15vw",
					  }
					: {}
			}
			{...props}
			autoPlay={true}
		/>
	);
}

export default Video;
