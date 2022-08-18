import { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSocket, usePeer } from "../../customerHooks";
import Modal from "../common/Modal";
import Video from "./Video";

import ShareIcon from "../../assets/share_icon.svg";

async function getVideoStream() {
	return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}

const getPeerStream = (call) => {
	return new Promise((resolve) => {
		call.on("stream", resolve);
	});
};

// TODO: Implement user leave, toggle mute, toggle video
function Room() {
	const { roomid } = useParams();
	const peer = usePeer();
	const socket = useSocket();
	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [myStream, setMyStream] = useState();
	const [showModal, setShowModal] = useState(false);
	const [myId, setMyId] = useState();

	const onPeerCall = useCallback(
		async (call) => {
			console.log("got a call from:", call.peer);
			call.answer(myStream);
			const theirStream = await getPeerStream(call);
			setUsers((users) => {
				const userExists = users.find((user) => user.id === call.peer);
				if (!!userExists) return users;
				return [...users, { id: call.peer, stream: theirStream }];
			});
		},
		[myStream]
	);

	const callFriends = useCallback(
		async (users) => {
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
		},
		[myStream, peer]
	);

	const ref = useRef();

	useEffect(() => {
		getVideoStream().then(setMyStream);
	}, []);

	useEffect(() => {
		if (!peer) return;

		peer.on("open", setMyId);

		peer.on("call", onPeerCall);

		return () => {
			peer.off("call");
		};
	}, [peer, onPeerCall]);

	useEffect(() => {
		if (!socket || !myId) return;

		socket.emit("peerid", myId);

		socket.emit("join-room", roomid);

		socket.on("room-joined", (users) => {
			const mappedUsers = users.map((user) => ({ id: user, stream: undefined }));
			setUsers(mappedUsers);
		});

		socket.on("join-error", (message) => {
			alert(message);
			navigate("/");
		});

		return () => {
			socket.off("room-joined");
			socket.off("join-error");
		};
	}, [socket, myId, roomid, navigate, peer]);

	useEffect(() => {
		if (!users.length || !myStream || !peer) return;
		callFriends(users);
	}, [users, myStream, peer, callFriends]);

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

	const videoGrid = [...new Array(y)].map((_, i) => {
		console.log("y loop called");
		return (
			<div className="row" key={`row-${i}`}>
				{[...new Array(x)].map((_, j) => {
					return streams[i * x + j] && <Video key={`row-${i}-video-${j}`} stream={streams[i * x + j]} />;
				})}
			</div>
		);
	});

	return (
		<>
			<button
				className="btn btn-outline-accent"
				onClick={toggleModal}
				style={{
					position: "fixed",
					top: "1%",
					left: "1%",
					padding: "0.75rem",
					aspectRatio: "1/1",
				}}>
				<img
					style={{
						aspectRatio: "1/1",
					}}
					src={ShareIcon}
					alt="Share Icon"
				/>
			</button>
			<div className={`video-container grid-${x}`}>
				{videoGrid.length ? videoGrid : <h1 className="text-fade">Waiting for someone to join</h1>}
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
