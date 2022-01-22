import {
  createContext,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketContextType {
  webSocket: Socket | null;
  sendEvent: (type: string, body: unknown) => void;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  webSocket: null,
  sendEvent: () => {},
});

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const wsUrl = "ws://localhost:2000";

export const WebSocketProvider: FunctionComponent<WebSocketProviderProps> = ({
  children,
}) => {
  const [webSocket, setWs] = useState<Socket | null>(null);

  useEffect(() => {
    if (!webSocket) {
      setWs(io(wsUrl));
    }
  }, [webSocket]);

  const sendEvent = useCallback(
    (type: string, body: unknown) => {
      if (webSocket) {
        webSocket?.emit(type, body);
      }
    },
    [webSocket]
  );

  return (
    <WebSocketContext.Provider
      value={{
        webSocket,
        sendEvent,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
