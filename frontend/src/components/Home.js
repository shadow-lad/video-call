import { useState } from "react";
import { useNavigate } from "react-router";

function Home() {
	const [roomid, setRoomId] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const onJoinRoom = async (event) => {
		event.preventDefault();
		setLoading(true);
		const res = await fetch(`/api/room?id=${roomid}`);
		if (res.ok) return navigate(`/${roomid}`);
		alert("Not a valid room");
		setLoading(false);
		setRoomId("");
	};

	return (
		<>
			<div className="center-container flex-column">
				<h1 className="text-xl">
					Let's join a <span className="accent">room!</span>
				</h1>
				<div className="room-input-container">
					<form method="POST" action="/api/room">
						<button disabled={loading} type="submit" className="btn btn-accent">
							Create a Room
						</button>
					</form>
					<h2>OR</h2>
					<form onSubmit={onJoinRoom} className="input-group">
						<input
							disabled={loading}
							className="input-control"
							type="text"
							onChange={(event) => setRoomId(event.target.value)}
							placeholder="Enter Code"
							value={roomid}
							minLength="6"
							maxLength="6"
						/>
						<button type="submit" disabled={loading} className="btn btn-outline-accent">
							Join
						</button>
					</form>
				</div>
			</div>
			<footer>
				<small>
					Created by <a href="https://github.com/shadow-lad">theshadowlad</a>
				</small>
			</footer>
		</>
	);
}

export default Home;
