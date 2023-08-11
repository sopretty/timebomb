import {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
  useMemo,
  ChangeEvent,
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

  const [nickname, setNickname] = useState<string>(
    localStorage.getItem("nickname") || ""
  );
  const [isReady, setReady] = useState<boolean>(false);
  const [isPageLoading, setPageLoading] = useState<boolean>(true);

  const { webSocket, joinGame } = useWebSocket();
  const { gameId } = useParams();
  const navigate = useNavigate();


  const gameUrl = useMemo(
    () => `http://localhost:3000/lobby/${gameId}`,
    [gameId]
  );
  const { hasCopied, onCopy } = useClipboard(gameUrl);

  const joinLobby = useCallback(() => {
    setReady(true);
    if(joinGame && gameId){
      joinGame(gameId, userId, nickname);
    } else {
     // TODO wait for the websocket connection before ?
    }


  }, [gameId, userId, nickname, joinGame, setReady]);

  const onNicknameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    localStorage.setItem('nickname', event.target.value);
  }, [setNickname]);

  useEffect(() => {
    if (webSocket) {
      webSocket?.on("game_started", (game) => {
        navigate(`/games/${game.id}`, { state: { from: "lobby" } });
      });
    }
  }, [webSocket, navigate]);

  useEffect(() => {
    setPageLoading(!isLoading ? isLoading : true);
  }, [isLoading]);

  const startGame = useCallback(() => {
    if (webSocket) {
      webSocket?.emit("start", { gameId });
    }
  }, [webSocket, gameId]);

  return (
    <>
      {isPageLoading && <Spinner size="xl" />}
      {!isReady && game && game.players.length < 8 && (
        <>
          <Input
            value={nickname}
            onChange={onNicknameChange}
            placeholder="Select a Nickname"
          />
          <Button isDisabled={!nickname} onClick={joinLobby}>
            Join the game
          </Button>
        </>
      )}
      {!isReady && game && game.players.length >= 7 && <>Game full</>}
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
      )}
    </>
  );
};
