import { FunctionComponent } from "react";
import { Box } from "@chakra-ui/react";

import { Card as CardType} from "../../types";

const defusingUrl = '/defusing-wire-card.png';
const bombUrl = '/bomb-card.jpeg';
const secureUrl = '/secure-wire-card.png';
const backUrl = '/card-back.png';

export const Card: FunctionComponent<CardType> = ({type}) => {

const imgUrl = type === "defusingWire" ? defusingUrl : type === 'bomb' ? bombUrl : type === 'secureWire' ? secureUrl : backUrl;

  return (
    <Box w={'50px'}>
        <img alt="not found" src={imgUrl} />
    </Box>
    );
  }