import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Flex, Button } from "@chakra-ui/react";

import { httpFetch } from "../utils/fetch";

export const LandingPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const createGame = useCallback(() => {
    const creatorId = uuid();
    localStorage.setItem("creatorId", creatorId);

    httpFetch<{ id: string; creatorId: string }>({
      method: "PUT",
      url: "http://localhost:2000/games",
      body: { creatorId },
    }).then((result) => {
      navigate(`/lobby/${result.id}`);
    });
  }, [navigate]);

  return (
    <Flex h="100%" justify="center">
      <Flex direction="column" justify="center">
        <Button onClick={createGame}>Create Game</Button>
      </Flex>
    </Flex>
  );
};
