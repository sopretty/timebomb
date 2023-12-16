import {
  FunctionComponent,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Flex,
  Spinner,
  Progress,
  Input,
  Button,
  useClipboard,
  Box,
  Tooltip,
} from "@chakra-ui/react";

import { useWebSocket } from "../context/WebSocketProvider";
import { useGame } from "../context/GameProvider";

export const LobbyPage: FunctionComponent = () => {
  const { game, isLoading, userId } = useGame();

  const { webSocket } = useWebSocket();
  const { gameId } = useParams();
  const navigate = useNavigate();

  const gameUrl = `http://localhost:3000/lobby/${gameId}`;

  const { hasCopied, onCopy } = useClipboard(gameUrl);

  useEffect(() => {
    if (webSocket) {
      webSocket?.on("game_started", (game) => {
        navigate(`/games/${game.id}`, { state: { from: "lobby" } });
      });
    }
  }, [webSocket, navigate]);

  const startGame = useCallback(() => {
    if (webSocket) {
      webSocket?.emit("start", { gameId });
    }
  }, [webSocket, gameId]);

  return (
    <>
      {isLoading && <Spinner size="xl" />}
      {game && game.players.length >= 7 && <>Game full</>}
        <>
          <Flex mb={2}>
            Invite your friends
            <Input value={gameUrl} isReadOnly placeholder="Game URL" />
            <Button onClick={onCopy} ml={2}>
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Flex>
          {!!game && (
            <Flex align="center" direction="column">
              Number of players: 4 - 8
              <Progress
                w="60%"
                value={(game.players.length / 8) * 100}
                size="md"
                colorScheme={game.players.length >= 4 ? "green" : "red"}
              />
              {game.players.length} Players:
              {game.players.sort().map((player) => (
                <Box key={player.id}>{player.nickname}</Box>
              ))}
              <Tooltip
                label={
                  userId !== game.creatorId
                    ? "Only the creator of the game can start it"
                    : game.players.length < 4
                    ? "You need to be at least 4 to start the game"
                    : null
                }
                shouldWrapChildren
              >
                <Button
                  onClick={startGame}
                  isDisabled={
                    userId !== game.creatorId || game.players.length < 4
                  }
                >
                  Start the game
                </Button>
              </Tooltip>
            </Flex>
          )}
        </>
    </>
  );
};
