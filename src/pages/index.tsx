import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  VStack,
  HStack,
  Button,
  Input,
  Text,
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
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/store';
import VideoChat from '@/components/VideoChat';
import ChatBox from '@/components/ChatBox';
import RoomControls from '@/components/RoomControls';

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const { setRoomId, setUsername: setStoreUsername } = useStore();

  useEffect(() => {
    // Check if user has a username
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      onOpen();
    } else {
      setUsername(storedUsername);
      setStoreUsername(storedUsername);
    }
  }, []);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      setStoreUsername(username);
      onClose();
      toast({
        title: 'Welcome!',
        description: `Hello, ${username}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createNewRoom = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    router.push(`/room/${newRoomId}`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading>Looking Glass</Heading>
        
        <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={8} w="full">
          <Box>
            <VideoChat />
          </Box>
          <Box>
            <ChatBox />
          </Box>
        </Grid>

        <RoomControls onCreateRoom={createNewRoom} />

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Welcome to Looking Glass</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text>Please enter your username to continue:</Text>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleUsernameSubmit}>
                  Continue
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
} 