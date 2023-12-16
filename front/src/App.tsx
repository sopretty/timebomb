import { BrowserRouter, Route, Routes } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { LandingPage } from "./pages/landing/LandingPage";
import { LobbyPage } from "./pages/lobby/LobbyPage";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { GamePage } from "./pages/game/GamePage";
import { GameProvider } from "./context/GameProvider";
import { InvitePage } from "./pages/invite/InvitePage";

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      "html, body, #root": {
        h: "100%",
      },
    },
  },
});

export const App = () => {
  const userId = localStorage.getItem("userId") ?? uuid();

  return (
    <ChakraProvider theme={theme}>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage userId={userId} />}></Route>
            <Route element={<GameProvider userId={userId}/>}>
              <Route path="/lobby/:gameId" element={<LobbyPage />}></Route>
              <Route path="/invite/:gameId" element={<InvitePage />}></Route>
              <Route path="/games/:gameId" element={<GamePage />}></Route>
            </Route>
            <Route path="*" element={<LandingPage userId={userId} />} />
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </ChakraProvider>
  );
};
