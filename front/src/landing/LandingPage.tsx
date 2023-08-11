import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";

import { httpFetch } from "../utils/fetch";

export const LandingPage: FunctionComponent<{userId: string}> = ({userId}) => {
  const navigate = useNavigate();

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

  return (
    <Flex h="100%" justify="center">
      <Flex direction="column" justify="center">
        <Button onClick={createGame}>Create Game</Button>
      </Flex>
    </Flex>
  );
};
