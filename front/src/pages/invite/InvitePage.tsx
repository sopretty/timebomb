import { ChangeEvent, FunctionComponent, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Button,  Input } from "@chakra-ui/react";

export const InvitePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  const [nickname, setNickname] = useState<string>(
    localStorage.getItem("nickname") ?? ""
  );

  const onNicknameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    localStorage.setItem('nickname', event.target.value);
  }, [setNickname]);

  const joinGame = useCallback(() => {
    navigate(`/lobby/${gameId}`);
  }, [navigate, gameId]);

  return (
    <Flex h="100%" justify="center">
      <Flex direction="column" justify="center">
          <Input
            value={nickname}
            onChange={onNicknameChange}
            placeholder="Select a Nickname"
          />
        <Button isDisabled={!nickname} onClick={joinGame}>Join the Game</Button>
      </Flex>
    </Flex>
  );
};
