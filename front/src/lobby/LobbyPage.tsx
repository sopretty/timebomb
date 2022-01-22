import {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
  useMemo,
  useContext,
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
import { v4 as uuid } from "uuid";

import { httpFetch } from "../utils/fetch";
import { WebSocketContext } from "../context/WebSocketProvider";

interface Game {
  id: string;
  creatorId: string;
  players: { id: string; nickname: string }[];
}

export const LobbyPage: FunctionComponent = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);

  const [nickname, setNickname] = useState<string>(
    localStorage.getItem("nickname") || ""
  );
  const [isReady, setReady] = useState<boolean>(false);

  const { webSocket, sendEvent } = useContext(WebSocketContext);
  const { gameId } = useParams();
  const navigate = useNavigate();

  const userId = useMemo(() => localStorage.getItem("userId") || uuid(), []);

  const gameUrl = useMemo(
    () => `http://localhost:3000/lobby/${gameId}`,
    [gameId]
  );
  const { hasCopied, onCopy } = useClipboard(gameUrl);

  useEffect(() => {
    if (!gameId) {
      navigate("/");
    }

    httpFetch<{
      id: string;
      creatorId: string;
      players: { id: string; nickname: string }[];
    }>({
      method: "GET",
      url: `http://localhost:2000/games/${gameId}`,
    })
      .then((createdGame) => {
        setLoading(false);
        setGame(createdGame);
      })
      .catch(() => {
        navigate("/");
      });
  }, [gameId, navigate]);

  const joinLobby = useCallback(() => {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("userId", userId);
    sendEvent("join", { gameId, player: { id: userId, nickname } });
    setReady(true);
  }, [nickname, userId, gameId, sendEvent]);

  const onNicknameChange = useCallback((event) => {
    setNickname(event.target.value);
  }, []);

  useEffect(() => {
    if (webSocket) {
      webSocket?.on("game_updated", (game) => {
        console.log(game);
        setGame(game);
      });
    }
  }, [webSocket]);

  const startGame = useCallback(() => {
    if (webSocket) {
      webSocket?.emit("start", { gameId });
    }
  }, [webSocket, gameId]);

  return (
    <>
      {isLoading && <Spinner size="xl" />}
      {!isReady && (
        <>
          <Input
            value={nickname}
            onChange={onNicknameChange}
            placeholder="Select a Nickname"
          />
          <Button disabled={!nickname} onClick={joinLobby}>
            Join the game
          </Button>
        </>
      )}
      {isReady && (
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
              Players:
              {game.players.map((player) => (
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
                  disabled={
                    userId !== game.creatorId || game.players.length < 4
                  }
                >
                  Start the game
                </Button>
              </Tooltip>
            </Flex>
          )}
        </>
      )}
    </>
  );
};
