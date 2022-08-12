import { useEffect, useState } from "react";
import { connect } from "socket.io-client";
import Peer from "peerjs";

export function usePeer() {
	const [peer, setPeer] = useState();

	useEffect(() => {
		const peer = new Peer();
		setPeer(peer);
	}, []);

	return peer;
}

export function useSocket() {
	const [socket, setSocket] = useState();

	useEffect(() => {
		const socket = connect("http://localhost:8080", { path: "/ws" });
		setSocket(socket);
	}, []);

	return socket;
}
