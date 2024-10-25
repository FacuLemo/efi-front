"use client"
import FetchData from '@/components/FetchData'
import React, { useState, useEffect, Fragment, use } from 'react'

function Page(context) {
  const [game, setGame] = useState(null);
  const [gameOnCart, setGameOnCart] = useState(false);
  const params = use(context.params)
  const { id } = params
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpZCI6MSwibmFtZSI6InZhbGVuIiwiZW1haWwiOiJ2YWxAZW4uY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaFdqS0JCWFZiUnJhMW1sb0Y4U1ZPdTlpM2ZPOXVEMmZGY0t4cGNUdjM2bXZ4S002Q2J3d3UiLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJyb2xlSWQiOjIsIlJvbGUiOnsiaWQiOjIsIm5hbWUiOiJST0xFX0FETUlOIn19LCJpYXQiOjE3Mjk3NDMxMTh9.C_X50u91LLHPQaOfC411I7ozV0kRaOYIlMCAINGrR54"

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const gameData = await FetchData(`games/${id}`, token);
        setGame(gameData);

        const gamesInCart = JSON.parse(localStorage.getItem('gamesInCart')) || [];
        if (gamesInCart.includes(id)) {
          setGameOnCart(true);
        }

      } catch (error) {
        console.error('Error loading game data', error);
      }
    };
    cargarDatos();
  }, [id]);

  const handleAddToCart = () => {
    const gamesInCart = JSON.parse(localStorage.getItem('gamesInCart')) || [];

    if (!gamesInCart.includes(id)) {
      gamesInCart.push(id);
      localStorage.setItem('gamesInCart', JSON.stringify(gamesInCart));
      setGameOnCart(true);
    } else {
      console.log('Game already on cart');
    }
  };

  if (!game) {
    return <p className='flex justify-center w-full p-20 text-5xl font-bold animate-pulse'>Loading...</p>;
  }

  return (
    <article className='flex flex-col justify-between'>
      <section className='p-12 flex justify-between'>
        <div>
          <h3 className='text-6xl capitalize font-bold'>{game.title}</h3>
          <p className='px-4 rounded-full bg-blue-300 inline-block font-bold'>{game.genre.name}</p>
        </div>

        <div className='transition-all ease-in-out'>
          {gameOnCart ? (
            <a
              className='w-[20rem] h-[3rem] items-center flex bg-black hover:scale-105 transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer'
              href='/carrito'
            >
              <p className='w-1/2 text-center text-lg'>ARS$ {game.price}</p>
              <p className='w-1/2 h-full flex items-center font-semibold justify-center text-center bg-blue-400'>Already on cart</p>
            </a>
          ) : (
            <button
              className='w-[20rem] h-[3rem] items-center flex bg-black hover:scale-105 transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-green-500/20 cursor-pointer'
              onClick={handleAddToCart}
            >
              <p className='w-1/2 text-center text-lg'>ARS$ {game.price}</p>
              <p className='w-1/2 h-full flex items-center font-semibold justify-center text-center bg-green-600'>Add to cart</p>
            </button>
          )}
        </div>
      </section>

      <section className='mx-12'>
        <div className='w-[15rem] items-center flex bg-black'>
          <p className='w-1/2 h-full flex items-center justify-center text-center bg-blue-300'>Platform</p>
          <p className='w-1/2 text-center text-lg'>{game.platform.name}</p>
        </div>
        <p>Total Sales: {game.sales}</p>
      </section>
    </article>
  );
}

export default Page;