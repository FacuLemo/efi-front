"use client"
import React, { Fragment, useEffect, useState, useContext } from 'react';
import FetchData from './FetchData';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function CartSummary({ updateCartTotal }) {
  const [cartGames, setCartGames] = useState([]);
  const { token, authStatus } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchCartGames = async () => {
      if (token) {
        const gamesInCart = await JSON.parse(localStorage.getItem("gamesInCart"));
        if (gamesInCart) {
          const fetchedGames = await Promise.all(
            gamesInCart.map(async (gameId) => {
              const data = await FetchData(`games/${gameId}`, token);
              return data;
            })
          )
          setCartGames(fetchedGames);
        }
      }
    }

    if (authStatus === 'authenticated') {
      fetchCartGames();
    } else if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, token])

  useEffect(() => {
    if (cartGames.length > 0) {
      const total = cartGames.reduce((sum, game) => sum + parseFloat(game.price), 0);
      updateCartTotal(total);
    }
  }, [cartGames, updateCartTotal]);

  const getTotal = () => {
    return cartGames.reduce((sum, game) => sum + parseFloat(game.price), 0);
  };

  if (authStatus === 'loading') {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }

  return (
    <section className="p-5">
      <div className="shadow-xl border border-gray-100">
        <div className="p-20">
          <div className="border-b border-b-gray-200">
            <p className="text-center p-4 text-blue-600 font-medium border-b-2 border-b-blue-600">Cart Summary</p>
          </div>

          {cartGames && cartGames.length > 0 ? (
            cartGames.map((game, index) => (
              <div key={index} className='flex w-full justify-between p-2 py-4 odd:bg-gray-700/10 even:bg-gray-700/20 px-10'>
                <p className='text-lg capitalize'>{game.title}</p>
                <p className='text-xl'>${game.price}</p>
              </div>
            ))
          ) : (
            <Fragment>
              <p className="text-center pt-20 text-gray-800 font-medium text-2xl">You have no products in your cart yet, keep browsing!</p>
              <div className="w-full flex justify-center mt-8">
                <a href="/tienda" className="text-center p-4 rounded-lg bg-blue-500 hover:bg-blue-600 shadow-xl text-white">
                  Back to main page
                </a>
              </div>
            </Fragment>
          )}

          <div className={cartGames && cartGames.length === 0 ? "hidden" : "flex items-center pt-10 gap-10 text-2xl justify-end  underline"}>
            <p>Total:</p>
            <p className='font-semibold'>$ {getTotal().toLocaleString("es-AR")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartSummary;