import { FunctionComponent, useCallback, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from "@chakra-ui/react";
import { useGame } from "../../context/GameProvider";

export const StartingGameModal: FunctionComponent = () => {
  const { player } = useGame();

  const [isOpen, setOpen] = useState<boolean>(true);

  console.log(player);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>New game has started !</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <div>Here is your role: {player?.role?.team}</div>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  );
};
