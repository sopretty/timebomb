import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { Game, Player } from "../types";
import { useWebSocket } from "./WebSocketProvider";

interface GameContextType {
  game: Game | null;
  isLoading: boolean;
  userId: string;
  player: Player | null;
}

export const GameContext = createContext<GameContextType>({
  game: null,
  isLoading: false,
  userId: '',
  player: null
});

export const GameProvider: FunctionComponent<{userId: string}> = ({userId}) => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { webSocket, isConnected, joinGame, openWs } = useWebSocket();

  const [game, setGame] = useState<Game | null>(null);
  const nickname = localStorage.getItem("nickname")

  useEffect(() => {
      openWs();
  }, [openWs])

  useEffect(() => {
    if(isConnected && !!joinGame && !!gameId && !!userId && !!nickname) {
      joinGame(gameId, userId, nickname);
    }
  }, [isConnected, gameId, userId, nickname, joinGame])

  useEffect(() => {
    if (webSocket) {
      webSocket?.on("game_updated", (game) => {
        setGame(game);
      });
      webSocket?.on("game_started", (game) => {
        setGame(game);
      });
      webSocket?.on("unjoinable_game", (game) => {
        navigate('/')
      });
    }
  }, [webSocket, navigate]);

  const player = game?.players.find((player) => player.id === userId);
  // const currentTurn = player ? player.turns[game.];

 const providersValues = useMemo(() => ({ game,
  isLoading: !isConnected,
  userId,
  player: player ?? null,}), [isConnected, player, userId, game])

  return (
    <GameContext.Provider
      value={providersValues}
    >
      <Outlet />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
