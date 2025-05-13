import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Heading,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useStore } from '@/store';
import VideoChat from '@/components/VideoChat';
import ChatBox from '@/components/ChatBox';

const Room = () => {
  const router = useRouter();
  const { id } = router.query;
  const { roomId, setRoomId, username } = useStore();
  const toast = useToast();

  useEffect(() => {
    if (!id || !username) {
      router.push('/');
      return;
    }

    setRoomId(id as string);
  }, [id, username]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!id || !username) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading>Room: {id}</Heading>

        <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={8} w="full">
          <Box>
            <VideoChat />
          </Box>
          <Box>
            <ChatBox />
          </Box>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Room; 