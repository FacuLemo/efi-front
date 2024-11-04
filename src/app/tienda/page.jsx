"use client"
import React, { useState, useEffect, useContext } from 'react';
import FetchData from '@/components/FetchData';
import GameCard from '../../components/GameCard';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function Page() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const { token, authStatus } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const genresData = await FetchData('genres', token);
        setGenres(genresData);

        const gamesData = await FetchData('games', token);
        setGames(gamesData);
      }
    };

    if (authStatus === 'authenticated') {
      fetchData();
    } else if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, token]);

  if (authStatus === 'loading') {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }

  return (
    <div>
      <div className='flex gap-10 wrap flex-wrap justify-evenly pt-10'>
        {games.length > 0 ? (
          games.map((game, index) => (
            <div key={index}>
              <GameCard game={game} />
            </div>
          ))
        ) : (
          <p className='text-3xl font-semibold animate-pulse m-20'>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Page;
