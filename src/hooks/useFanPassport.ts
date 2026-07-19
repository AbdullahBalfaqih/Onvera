import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

export interface FanPassport {
  id: string;
  userId: string;
  favoriteTeam: string;
  favoritePlayer: string | null;
  level: number;
  xp: number;
  reputation: number;
  nftMintAddress: string | null;
}

export interface User {
  id: string;
  walletAddress: string;
  passport: FanPassport | null;
}

export function useFanPassport() {
  const { connected, publicKey } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (connected && publicKey) {
        setLoading(true);
        try {
          const response = await axios.post('/api/auth', {
            walletAddress: publicKey.toBase58()
          });
          setUser(response.data.user);
        } catch (error) {
          console.error("Failed to fetch/create Fan Passport:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
      }
    }

    fetchUser();
  }, [connected, publicKey]);

  return { user, passport: user?.passport, loading };
}
