import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  useToast,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaDesktop } from 'react-icons/fa';
import { useStore } from '@/store';
import { useWebRTC } from '@/hooks/useWebRTC';

const VideoChat = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { isCameraOn, isMicOn, isScreenSharing, toggleCamera, toggleMic, toggleScreenSharing } = useStore();
  const toast = useToast();
  const { peers, startStream, stopStream } = useWebRTC();

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        startStream(mediaStream);
      } catch (error) {
        toast({
          title: 'Error accessing media devices',
          description: 'Please make sure you have granted camera and microphone permissions.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    initializeMedia();

    return () => {
      stopStream();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setStream(screenStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        startStream(screenStream);
      } else {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        startStream(mediaStream);
      }
      toggleScreenSharing();
    } catch (error) {
      toast({
        title: 'Error sharing screen',
        description: 'Please make sure you have selected a window or screen to share.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} w="full">
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={4}
        w="full"
      >
        <Box
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          bg="gray.800"
          aspectRatio="16/9"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Text
            position="absolute"
            bottom={2}
            left={2}
            color="white"
            bg="blackAlpha.600"
            px={2}
            py={1}
            borderRadius="md"
          >
            You
          </Text>
        </Box>

        {peers.map((peer, index) => (
          <Box
            key={peer.id}
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg="gray.800"
            aspectRatio="16/9"
          >
            <video
              ref={peer.videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Text
              position="absolute"
              bottom={2}
              left={2}
              color="white"
              bg="blackAlpha.600"
              px={2}
              py={1}
              borderRadius="md"
            >
              Peer {index + 1}
            </Text>
          </Box>
        ))}
      </Grid>

      <HStack spacing={4}>
        <IconButton
          aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          icon={isCameraOn ? <FaVideo /> : <FaVideoSlash />}
          onClick={toggleCamera}
          colorScheme={isCameraOn ? 'blue' : 'red'}
        />
        <IconButton
          aria-label={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
          icon={isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          onClick={toggleMic}
          colorScheme={isMicOn ? 'blue' : 'red'}
        />
        <IconButton
          aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
          icon={<FaDesktop />}
          onClick={handleScreenShare}
          colorScheme={isScreenSharing ? 'red' : 'blue'}
        />
      </HStack>
    </VStack>
  );
};

export default VideoChat; 