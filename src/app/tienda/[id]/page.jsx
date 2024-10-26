"use client"
import FetchData from '@/components/FetchData'
import React, { useState, useEffect, useContext, use } from 'react'
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function Page(context) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([])
  const [gameOnCart, setGameOnCart] = useState(false);
  const params = use(context.params)
  const { id } = params
  const { token, authStatus } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const gameData = await FetchData(`games/${id}`, token);
          setGame(gameData);

          const reviewData = await FetchData(`reviews/${id}`, token)
          setReviews(reviewData)
          console.log("🚀 ~ fetchData ~ reviewData:", reviewData)

          const gamesInCart = JSON.parse(localStorage.getItem('gamesInCart')) || [];
          if (gamesInCart.includes(id)) {
            setGameOnCart(true);
          }

        } catch (error) {
          console.error('Error loading game data', error);
        }
      }
    };

    if (authStatus === 'authenticated') {
      fetchData();
    } else if (authStatus === 'unauthenticated') {
      router.push('/login');
    }

  }, [id, authStatus, token]);

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
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
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

      <section className='w-screen flex justify-center'>
        <div className='w-10/12'>

          {reviews ? (
            reviews.map((r, i) => {
              return (
                <div
                  key={`review-${i}`}
                  className='flex w-11/12 m-5 px-4 py-2 border-2 border-solid border-white'
                >
                  <div
                    className='flex mr-5 pr-5 border-r-white border-r-2'
                  >
                    <p>usuario</p>
                  </div>
                  <div className='w-full'>
                    <div 
                      className='w-full flex justify-between gap-4'
                    >
                      <p>
                        {r.rating}
                      </p>
                      <p>
                        {r.createdAt}
                      </p>
                        {
                          r.updatedAt != r.createdAt
                            ? <p> r.updatedAt </p>
                            : null
                        }
                    </div>
                    <p>
                      {r.comment}
                    </p>
                  </div>
                </div>
              )
            })
          ) : null}
        </div>
      </section>

    </article>
  );
}

export default Page;