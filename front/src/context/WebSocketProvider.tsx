import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketContextType {
  webSocket: Socket | null;
  isConnected: boolean;
  sendEvent: ((type: string, body: unknown) => void) | null;
  openWs: () => void;
  joinGame: ((gameId: string, playerId: string, playerNickname: string) => void) | null;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  webSocket: null,
  isConnected: false,
  sendEvent: null,
  joinGame: null,
  openWs: () => {}
});

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const wsUrl = "ws://localhost:2000";

export const WebSocketProvider: FunctionComponent<WebSocketProviderProps> = ({
  children,
}) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);
  const [isConnected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (webSocket) {
      webSocket.on("connect", () => {
        setConnected(true);
      });
    }
  }, [webSocket]);
  const sendEvent = useCallback(
    (type: string, body: unknown) => {
      if (isConnected) {
        webSocket?.emit(type, body);
      }
    },
    [isConnected, webSocket]
  );

  if(webSocket){
    console.log(webSocket.disconnected)
  }

  const openWs = useCallback(
    () => {
      if (!webSocket) {
        setWebSocket(io(wsUrl));
      }
    },
    [webSocket]
  );

  const joinGame = useCallback(
    (gameId: string, playerId: string, playerNickname: string) => {
      console.log({ isConnected, sendEvent });
      if (!!isConnected && !!sendEvent) {
        sendEvent("join", {
          gameId,
          player: { id: playerId, nickname: playerNickname },
        });
      }
    },
    [isConnected, sendEvent]
  );

  return (
    <WebSocketContext.Provider
      value={{
        webSocket,
        isConnected,
        openWs,
        sendEvent: isConnected ? sendEvent : null,
        joinGame: isConnected ? joinGame : null,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
