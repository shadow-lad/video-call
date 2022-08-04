import { Navigate, Route, Routes } from "react-router";
import Nav from "./components/common/Nav";
import Home from "./components/Home";
import Room from "./components/Room";

function App() {
	return (
		<>
			<Nav />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/room/:roomid" element={<Room />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</>
	);
}

export default App;
