import { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSocket, usePeer } from "../../customerHooks";
import Modal from "../common/Modal";
import Video from "./Video";

async function getVideoStream() {
	return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}

const getPeerStream = (call) => {
	return new Promise((resolve) => {
		call.on("stream", resolve);
	});
};

function Room() {
	const { roomid } = useParams();
	const peer = usePeer();
	const socket = useSocket();
	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [myStream, setMyStream] = useState();
	const [showModal, setShowModal] = useState(false);

	const ref = useRef();

	useEffect(() => {
		getVideoStream().then(setMyStream);
	}, []);

	useEffect(() => {
		if (!socket || !peer || !myStream) return;

		peer.on("open", (id) => {
			socket.emit("peerid", id);

			socket.emit("join-room", roomid);

			socket.on("room-joined", (users) => {
				const mappedUsers = users.map((user) => ({ id: user, stream: undefined }));
				setUsers(mappedUsers);

				peer.on("call", async (call) => {
					console.log("got a from:", call.peer);
					call.answer(myStream);
					const theirStream = await getPeerStream(call);
					setUsers((users) => {
						return [...users, { id: call.peer, stream: theirStream }];
					});
				});
			});

			socket.on("join-error", (message) => {
				alert(message);
				navigate("/");
			});
		});
	}, [socket, peer, roomid, navigate, myStream]);

	useEffect(() => {
		if (!users.length || !myStream || !peer) return;

		const callFriends = async () => {
			for (let i = 0; i < users.length; i++) {
				if (users[i].stream) continue;
				const call = peer.call(users[i].id, myStream);
				console.log("calling:", users[i].id);
				const theirStream = await getPeerStream(call);
				setUsers((users) => {
					users[i].stream = theirStream;
					return [...users];
				});
			}
		};
		callFriends();
	}, [users, myStream, peer]);

	const toggleModal = () => {
		setShowModal((old) => !old);
	};

	const copyText = () => {
		const message = `Join me in a video call at: ${window.location.href}`;
		navigator.clipboard.writeText(message);
		alert("Text copied to clipboard");
		toggleModal();
	};

	const streams = users.filter((user) => !!user.stream).map((user) => user.stream);

	const x = streams.length > 4 ? 3 : streams.length > 2 ? 2 : 1;

	let y = Math.ceil(streams.length / x);

	return (
		<>
			<button
				className="btn btn-outline-accent"
				onClick={toggleModal}
				style={{
					position: "fixed",
					top: "1%",
					left: "1%",
				}}>
				Share Link
			</button>
			<div className={`video-container grid-${x}`}>
				{[...new Array(y)].map((_, i) => {
					console.log("y loop called");
					return (
						<div className="row" key={`row-${i}`}>
							{[...new Array(x)].map((_, j) => {
								return streams[i * x + j] && <Video key={`row-${i}-video-${j}`} stream={streams[i * x + j]} />;
							})}
						</div>
					);
				})}
			</div>
			{myStream && <Video id="my-video" stream={myStream} volume={0} />}
			{showModal && (
				<Modal onClose={toggleModal}>
					<h6>Share Link</h6>
					<hr style={{ margin: "0.5rem 0", color: "var(--color-accent)" }} />
					<div className="input-group">
						<input ref={ref} type="text" disabled={true} className="input-control" value={window.location.href} />
						<button onClick={copyText} className="btn btn-accent">
							Copy Link
						</button>
					</div>
				</Modal>
			)}
		</>
	);
}

export default Room;
