import { useEffect, useRef, useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useStore } from '@/store';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { roomId, username } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || !username) return;

    try {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesRef, {
        sender: username,
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box
      h="full"
      borderWidth={1}
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      overflow="hidden"
    >
      <VStack h="full" spacing={0}>
        <Box
          flex={1}
          w="full"
          overflowY="auto"
          p={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray',
              borderRadius: '24px',
            },
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              mb={4}
              maxW="80%"
              ml={message.sender === username ? 'auto' : 0}
            >
              <Text
                fontSize="sm"
                color="gray.500"
                mb={1}
                textAlign={message.sender === username ? 'right' : 'left'}
              >
                {message.sender}
              </Text>
              <Box
                bg={message.sender === username ? 'blue.500' : 'gray.100'}
                color={message.sender === username ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                display="inline-block"
              >
                <Text>{message.content}</Text>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box w="full" p={4} borderTopWidth={1} borderColor={borderColor}>
          <form onSubmit={handleSendMessage}>
            <Flex>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                mr={2}
              />
              <Button type="submit" colorScheme="blue">
                Send
              </Button>
            </Flex>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default ChatBox; 