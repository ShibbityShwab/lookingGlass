import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/store';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

interface Peer {
  id: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  peer: any; // simple-peer instance
}

export const useWebRTC = () => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const { roomId, username } = useStore();
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [key: string]: Peer }>({});

  useEffect(() => {
    if (!roomId || !username) return;

    const roomRef = doc(db, 'rooms', roomId);
    const userRef = doc(roomRef, 'users', username);

    // Create user document
    setDoc(userRef, {
      id: username,
      timestamp: Date.now(),
    });

    // Listen for other users
    const unsubscribe = onSnapshot(collection(roomRef, 'users'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const userData = change.doc.data();
        if (userData.id === username) return;

        if (change.type === 'added') {
          // New user joined
          const peer = createPeer(userData.id, true);
          peersRef.current[userData.id] = {
            id: userData.id,
            videoRef: { current: null },
            peer,
          };
          setPeers(Object.values(peersRef.current));
        }

        if (change.type === 'removed') {
          // User left
          if (peersRef.current[userData.id]) {
            peersRef.current[userData.id].peer.destroy();
            delete peersRef.current[userData.id];
            setPeers(Object.values(peersRef.current));
          }
        }
      });
    });

    return () => {
      unsubscribe();
      deleteDoc(userRef);
      Object.values(peersRef.current).forEach(({ peer }) => peer.destroy());
    };
  }, [roomId, username]);

  const createPeer = (userId: string, initiator: boolean) => {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream: localStreamRef.current,
    });

    peer.on('signal', (data) => {
      const signalRef = doc(db, 'rooms', roomId!, 'signals', `${username}-${userId}`);
      setDoc(signalRef, {
        from: username,
        to: userId,
        data,
      });
    });

    peer.on('stream', (stream) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].videoRef.current!.srcObject = stream;
      }
    });

    return peer;
  };

  const startStream = (stream: MediaStream) => {
    localStreamRef.current = stream;
    Object.values(peersRef.current).forEach(({ peer }) => {
      peer.addStream(stream);
    });
  };

  const stopStream = () => {
    localStreamRef.current = null;
    Object.values(peersRef.current).forEach(({ peer }) => {
      peer.removeStream();
    });
  };

  return { peers, startStream, stopStream };
}; 