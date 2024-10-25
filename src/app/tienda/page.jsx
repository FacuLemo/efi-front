"use client"
import React, { useState, useEffect } from 'react'
import FetchData from '@/components/FetchData';
import GameCard from '../../components/GameCard'
import { stringify } from 'postcss';

function page() {
  const [games, setGames] = useState([])
  const [genres, setGenres] = useState([])
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpZCI6MSwibmFtZSI6InZhbGVuIiwiZW1haWwiOiJ2YWxAZW4uY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaFdqS0JCWFZiUnJhMW1sb0Y4U1ZPdTlpM2ZPOXVEMmZGY0t4cGNUdjM2bXZ4S002Q2J3d3UiLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJyb2xlSWQiOjIsIlJvbGUiOnsiaWQiOjIsIm5hbWUiOiJST0xFX0FETUlOIn19LCJpYXQiOjE3Mjk3NDMxMTh9.C_X50u91LLHPQaOfC411I7ozV0kRaOYIlMCAINGrR54"

  useEffect(() => {
    const cargarDatos = async () => {
      const genresData = await FetchData('genres', token);
      setGenres(genresData);
  
      const gamesData = await FetchData('games', token);
      setGames(gamesData);
    }
  
    cargarDatos();
  }, []);
  
  return (
    <div>

      <div className='flex gap-10 wrap flex-wrap justify-evenly pt-10'>
        {
          games.length > 0 ? (
            games.map((game, index) => (
              <div key={index}>
                <GameCard game={game}></GameCard>
              </div>
            ))
          ) :
            (
              <p className='text-3xl font-semibold animate-pulse m-20'>Cargando...</p>
            )
        }
      </div>

    </div>
  )
}

export default page