import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { Game, Player } from "../types";
import { httpFetch } from "../utils/fetch";
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
  const { webSocket } = useWebSocket();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (webSocket) {
      webSocket?.on("game_updated", (game) => {
        setGame(game);
      });
      webSocket?.on("game_started", (game) => {
        setGame(game);
      });
    }
  }, [webSocket]);

  useEffect(() => {
    if (!gameId) {
      navigate("/");
      return;
    }

    if (!!gameId && !game && !isLoading ) {
      setIsLoading(true);
      httpFetch<Game>({
        method: "GET",
        url: `http://localhost:2000/games/${gameId}`,
      })
        .then((createdGame) => {
          setGame(createdGame);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          navigate("/");
        });
    }
  }, [gameId, game, isLoading, navigate]);



  const player = game?.players.find((player) => player.id === userId);
  // const currentTurn = player ? player.turns[game.];

  console.log(userId, game, player)

  return (
    <GameContext.Provider
      value={{
        game,
        isLoading,
        userId,
        player: player || null,
      }}
    >
      <Outlet />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
