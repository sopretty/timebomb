import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Flex, Button } from "@chakra-ui/react";

import { httpFetch } from "../utils/fetch";

export const LobbyPage: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
  }, []);

  return <>{loading && <Spinner size="xl" />}</>;
};
