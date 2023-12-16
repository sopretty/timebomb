import { ChangeEvent, FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button,  Input } from "@chakra-ui/react";

import { httpFetch } from "../../utils/fetch";

export const LandingPage: FunctionComponent<{userId: string}> = ({userId}) => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState<string>(
    localStorage.getItem("nickname") ?? ""
  );

  const createGame = useCallback(() => {
    localStorage.setItem("userId", userId);

    httpFetch<{ id: string; creatorId: string }>({
      method: "PUT",
      url: "http://localhost:2000/games",
      body: { creatorId: userId },
    }).then((result) => {
      navigate(`/lobby/${result.id}`);
    });
  }, [userId, navigate]);

  const onNicknameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    localStorage.setItem('nickname', event.target.value);
  }, [setNickname]);

  return (
    <Flex h="100%" justify="center">
      <Flex direction="column" justify="center">
          <Input
            value={nickname}
            onChange={onNicknameChange}
            placeholder="Select a Nickname"
          />
        <Button isDisabled={!nickname} onClick={createGame}>Create Game</Button>
      </Flex>
    </Flex>
  );
};
