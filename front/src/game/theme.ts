import { BoxProps, ImageProps } from "@chakra-ui/react";


interface PlayerTheme {
  image: ImageProps;
  cards: BoxProps;
  nickname: BoxProps;
}

interface GamePageTheme {
  page: BoxProps;
  table: BoxProps;
  player: PlayerTheme;
  player0: PlayerTheme;
  player1: PlayerTheme;
  player2: PlayerTheme;
  player3: PlayerTheme;
  player4: PlayerTheme;
  player5: PlayerTheme;
  player6: PlayerTheme;
  player7: PlayerTheme;
}

export const currentPlayerTheme: PlayerTheme = {
  nickname: {
    border: '2px solid blue'
  },
  cards: {
    border: '2px solid blue'
  },
  image: {
    border: '2px solid blue'
  }
}

export const gamePagetheme: GamePageTheme = {
  page: {
    h: "100vh",
    w: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    w: "1082px",
    h: "630px",
    bg: "#4aad4a",
    border: "15px solid #666666",
    borderRadius: "120px",
    pos: "relative",
    _before: {
      content: '""',
      border: "7px solid rgba(0, 0, 0, .1)",
      w: "1052px",
      h: "600px",
      borderRadius: "105px",
      pos: "absolute",
    },
  },
  player: {
    image: {
      borderRadius: "50%",
      h: "80px",
      w: "80px",
      border: "1px solid #000000",
      pos: "absolute",
    },
    cards: {
      border: "5px solid #63c763",
      h: "120px",
      w: "280px",
      padding: "5px",
      pos: "absolute",
      borderRadius: "10px",
    },
    nickname: {
      pos: "absolute",
    },
  },
  player0: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/0.png`,
      top: "-60px",
      left: "245px",
    },
    cards: {
      top: "40px",
      left: "150px",
    },
    nickname: {
      top: "-90px",
      left: "245px",
    },
  },
  player1: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/1.png`,
      top: "-60px",
      right: "245px",
    },
    cards: {
      top: "40px",
      right: "150px",
    },
    nickname: {
      top: "-90px",
      right: "245px",
    },
  },
  player2: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/2.png`,
      bottom: "-50px",
      left: "245px",
    },
    cards: {
      bottom: "40px",
      left: "150px",
    },
    nickname: {
      bottom: "-80px",
      left: "245px",
    },
  },
  player3: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/3.png`,
      bottom: "-50px",
      right: "245px",
    },
    cards: {
      bottom: "40px",
      right: "150px",
    },
    nickname: {
      bottom: "-80px",
      right: "245px",
    },
  },
  player4: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/4.png`,
      top: "-60px",
      left: "245px",
    },
    cards: {
      top: "40px",
      left: "150px",
    },
    nickname: {},
  },
  player5: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/5.png`,
      top: "-60px",
      left: "245px",
    },
    cards: {
      top: "40px",
      left: "150px",
    },
    nickname: {},
  },
  player6: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/6.png`,
      top: "-60px",
      left: "245px",
    },
    cards: {
      top: "40px",
      left: "150px",
    },
    nickname: {},
  },
  player7: {
    image: {
      src: `${process.env.PUBLIC_URL}/avatars/7.png`,
      top: "-60px",
      left: "245px",
    },
    cards: {
      top: "40px",
      left: "150px",
    },
    nickname: {},
  },
};
