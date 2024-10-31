import { Routes, Route } from "react-router-dom";

// COMPONENTS
import { Home } from "./pages/home/home";
import { Room } from "./pages/room/room";
import { ChooseName } from "./pages/choose-name/choose-name";

// PROVIDERS
import { RoomContextProvider } from "./store/room-ctx";

// STYLES
import "./App.scss";

import Socket from "./socket";

Socket.createSocket();

function App() {
  return (
    <>
      <h1>Welcome to the quick task estimation tool for scrum teams</h1>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/room/:roomId"
            element={
              <RoomContextProvider>
                <Room />
              </RoomContextProvider>
            }
          />

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
