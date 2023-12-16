import { FunctionComponent } from "react";
import { Box } from "@chakra-ui/react";

import { Card as CardType} from "../../../types";

const defusingUrl = '/defusing-wire-card.png';
const bombUrl = '/bomb-card.jpeg';
const secureUrl = '/secure-wire-card.png';
const backUrl = '/card-back.png';

export const Card: FunctionComponent<CardType> = ({type}) => {

  const isDefusingWireCard = type === "defusingWire";
  const isSecureWireCard = type === "secureWire";
  const isBombCard = type === "bomb";

let bcgImgUrl = backUrl;
  if(isDefusingWireCard){
    bcgImgUrl = defusingUrl
  }
  if(isSecureWireCard){
    bcgImgUrl= secureUrl
  }
  if(isBombCard){
    bcgImgUrl= bombUrl
  }


// const imgUrl = isDefusingWireCard ? defusingUrl : isBombCard ? bombUrl : isSecureWireCard ? secureUrl : backUrl;

  return (
    <Box w={'50px'}>
        <img alt="not found" src={bcgImgUrl} />
    </Box>
    );
  }