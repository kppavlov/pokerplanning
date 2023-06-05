import { Routes, Route } from "react-router-dom";
import { Home } from "./components/home/home";
import { Room } from "./components/room/room";
import "./App.scss";
import { ChooseName } from "./components/choose-name/choose-name";
import Socket from "./socket";

Socket.createSocket();

function App() {
  return (
    <>
      <h1>Welcome to the quick task estimation tool</h1>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/choose-name" element={<ChooseName />} />
          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found</h2>
              </div>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
