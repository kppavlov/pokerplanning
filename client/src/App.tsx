import { Routes, Route } from "react-router-dom";
import { Home } from "./components/home/home";
import { Room } from "./components/room/room";
import "./App.scss";
import { ChooseName } from "./components/choose-name/choose-name";

function App() {
  return (
    <>
      <h1>Welcome</h1>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/choose-name" element={<ChooseName />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
