import { FunctionComponent } from "react";
import { Box, Image, Spinner, Text } from "@chakra-ui/react";

import { currentPlayerTheme, gamePagetheme } from "./theme";
import { useGame } from "../context/GameProvider";
import { StartingGameModal } from "./components/StartingGameModal";
import { Card } from "./components/Card";

export const GamePage: FunctionComponent = () => {
  const { isLoading, game, userId } = useGame();

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  console.log(game);


  return (
    <div>
    <StartingGameModal />
    <Box {...gamePagetheme.page}>
      <Box {...gamePagetheme.table}>
        {/* <Box
          {...{
            border: "5px solid #63c763",
            w: "80px",
            h: "280px",
            pos: "absolute",
            borderRadius: "10px",
            p: "10px",
            top: "140px",
            left: "40px",
          }}
        ></Box>
        <Box
          {...{
            border: "5px solid #63c763",
            w: "80px",
            h: "280px",
            pos: "absolute",
            borderRadius: "10px",
            p: "10px",
            top: "140px",
            right: "40px",
          }}
        ></Box> */}
        {game?.players.map((player, index) => (
          <Box key={player.id}>
            <Text
              {...{
                ...gamePagetheme.player.nickname,
                ...(player.id === userId ? currentPlayerTheme.nickname: {}),
                ...(gamePagetheme as any)[`player${index}`].nickname,
              }}
            >
              {player.nickname}
            </Text>
            <Image
              {...{
                ...gamePagetheme.player.image,
                ...(player.id === userId ? currentPlayerTheme.image: {}),
                ...(gamePagetheme as any)[`player${index}`].image,
              }}
            />
            <Box
              {...{
                ...gamePagetheme.player.cards,
                ...(player.id === userId ? currentPlayerTheme.cards: {}),
                ...(gamePagetheme as any)[`player${index}`].cards,
              }}
            >
              <Box display="flex" flexDirection="row" justifyContent="space-between"
              h="100%"
              alignItems="center">
            {!!player && player.turns && player.turns.length > game.currentTurnIndex ? player?.turns[game.currentTurnIndex].cards.map((card, index) => (
                <Card key={index} {...card}></Card>
                ) ) : null}
                </Box>
            </Box>
          </Box>
        ))}
        {/* <Box
          {...{
            border: "5px solid #63c763",
            h: "80px",
            w: "280px",
            pos: "absolute",
            borderRadius: "10px",
            p: "10px",
            top: "40px",
            left: "150px",
          }}
        ></Box>
        <Box
          {...{
            border: "5px solid #63c763",
            h: "80px",
            w: "280px",
            pos: "absolute",
            borderRadius: "10px",
            p: "10px",
            bottom: "40px",
            right: "150px",
          }}
        ></Box>
        <Box
          {...{
            border: "5px solid #63c763",
            h: "80px",
            w: "280px",
            pos: "absolute",
            borderRadius: "10px",
            p: "10px",
            bottom: "40px",
            left: "150px",
          }}
        ></Box> */}
        {/* <Box
          {...{
            border: "5px solid #63c763",
            h: "80px",
            w: "280px",
            pos: "absolute",
            borderRadius: "10px",
            p: "10px",
            top: "40px",
            left: "390px",
          }}
        ></Box> */}
      </Box>
    </Box>
    </div>
  );
};
