import { useParams } from "react-router";

function Room() {
	const { roomid } = useParams();

	return <h1>{roomid}</h1>;
}

export default Room;
