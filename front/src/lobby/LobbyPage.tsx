import {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Spinner, Input, Button, useClipboard } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";

import { httpFetch } from "../utils/fetch";

export const LobbyPage: FunctionComponent = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [nickname, setNickname] = useState<string>(
    localStorage.getItem("nickname") || ""
  );
  const [isReady, setReady] = useState<boolean>(false);

  const { gameId } = useParams();
  const navigate = useNavigate();

  const gameUrl = useMemo(
    () => `http://localhost:3000/lobby/${gameId}`,
    [gameId]
  );
  const { hasCopied, onCopy } = useClipboard(gameUrl);

  useEffect(() => {
    if (!gameId) {
      navigate("/");
    }

    httpFetch<{ id: string; creatorId: string }>({
      method: "GET",
      url: `http://localhost:2000/games/${gameId}`,
    })
      .then((result) => {
        setLoading(false);
        // connect ws
      })
      .catch(() => {
        navigate("/");
      });
  }, [gameId, navigate]);

  const joinLobby = useCallback(() => {
    const creatorId = localStorage.getItem("creatorId") || uuid();
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("creatorId", creatorId);
    setReady(true);
  }, [nickname]);

  const onNicknameChange = useCallback((event) => {
    setNickname(event.target.value);
  }, []);

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
          <Button onClick={joinLobby}>Create Game</Button>
        </>
      )}
      {isReady && (
        <Flex mb={2}>
          Invite your friends
          <Input value={gameUrl} isReadOnly placeholder="Game URL" />
          <Button onClick={onCopy} ml={2}>
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </Flex>
      )}
    </>
  );
};
