import { useState } from 'react';
import {
  HStack,
  Button,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useStore } from '@/store';

interface RoomControlsProps {
  onCreateRoom: () => void;
}

const RoomControls = ({ onCreateRoom }: RoomControlsProps) => {
  const [roomId, setRoomId] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const { setRoomId: setStoreRoomId } = useStore();

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a room ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setStoreRoomId(roomId);
    router.push(`/room/${roomId}`);
  };

  return (
    <HStack spacing={4}>
      <Button colorScheme="blue" onClick={onCreateRoom}>
        Create New Room
      </Button>
      <Button onClick={onOpen}>Join Room</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <HStack>
              <Input
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleJoinRoom}>
                Join
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default RoomControls; 