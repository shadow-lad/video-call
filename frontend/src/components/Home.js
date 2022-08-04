function Home() {
	return (
		<div className="center-container flex-column">
			<h1 className="text-xl">
				Let's join a <span className="accent">room!</span>
			</h1>
			<div className="room-input-container">
				<form method="POST" action="/api/create-room">
					<button type="submit" className="btn btn-accent">
						Create a Room
					</button>
				</form>
				<h2>OR</h2>
				<div className="input-group">
					<input className="input-control" type="text" placeholder="Enter Code" />
					<button className="btn btn-outline-accent">Join</button>
				</div>
			</div>
		</div>
	);
}

export default Home;
