import { Navigate, Route, Routes } from "react-router";
import Home from "./components/Home";
import Room from "./components/Room";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/room/:roomid" element={<Room />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</>
	);
}

export default App;
