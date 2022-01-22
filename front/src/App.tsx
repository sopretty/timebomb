import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { LandingPage } from "./landing/LandingPage";
import { LobbyPage } from "./lobby/LobbyPage";
import { WebSocketProvider } from "./context/WebSocketProvider";

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
  return (
    <ChakraProvider theme={theme}>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/lobby/:gameId" element={<LobbyPage />}></Route>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </ChakraProvider>
  );
};
