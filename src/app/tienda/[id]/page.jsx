"use client"
import FetchData from '@/components/FetchData'
import PostData from '@/components/PostData';
import React, { useState, useEffect, useContext, use } from 'react'
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import pfp from '@/../public/pfp.webp'
import toArgDate from '@/utils/toArgDate';
import StarFilled from '@/../public/StarFilled.svg'
import StarOutline from '@/../public/StarOutline.svg'

function Page(context) {
  const params = use(context.params)
  const { id } = params
  const { user, token, authStatus } = useContext(AuthContext);
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isOwned, setIsOwned] = useState(false);
  const [gameOnCart, setGameOnCart] = useState(false);
  const [comment, setComment] = useState({
    enabled: true,
    text: '',
    rating: 5,
  });

  const handleAddToCart = () => {
    const gamesInCart = JSON.parse(localStorage.getItem('gamesInCart')) || [];
    if (!gamesInCart.includes(id)) {
      gamesInCart.push(id);
      localStorage.setItem('gamesInCart', JSON.stringify(gamesInCart));
      setGameOnCart(true);
    } else {
      console.error('Game already on cart');
    }
  };

  const handleComment = (key, value) => {
    setComment({
      ...comment,
      [key]: value
    })
  }

  const handleCommentText = handleComment.bind(null, 'text')
  const handleCommentEnabled = handleComment.bind(null, 'enabled')
  const handleRatingUp = (e) => {
    e.preventDefault()
    if (comment.rating >= 5) return;
    setComment((prev) => {
      return {
        ...prev,
        rating: prev.rating + 1
      }
    })
  }
  const handleRatingDown = (e) => {
    e.preventDefault()
    if (comment.rating <= 1) return;
    setComment((prev) => {
      return {
        ...prev,
        rating: prev.rating - 1
      }
    })
  }

  const handlePostComment = async (formData) => {
    try {
      await PostData('reviews', {
        comment: comment.text,
        rating: comment.rating,
        gameId: id,
      }, token)
      location.reload()
    } catch (error) {
      console.error('Error posting comment', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const gameData = await FetchData(`games/${id}`, token);
          setGame(gameData);

          const reviewData = await FetchData(`reviews/${id}`, token)

          const profilePurchases = await FetchData("purchases/", token);
          try {
            profilePurchases.map((game, index) => (
              game.GameId == id ? setIsOwned(true) : ""
            ))
          }
          catch (e) {
            console.error("Error obteniendo el historial de compras del usuario", e)
          }
          let users = {}
          const completeReviews = await Promise.all(reviewData.map(async (r) => {
            if (!(r.UserId in users)) {
              users[`${r.UserId}`] = await FetchData(`users/${r.UserId}`, token)
            }

            if (r.UserId == user.id) {
              handleCommentEnabled(false)
            }

            return {
              ...r,
              user: users[`${r.UserId}`]
            }
          }))

          setReviews(completeReviews)

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
          {isOwned ?
            (<div>
              <div
                className='w-[20rem] h-[3rem] items-center flex bg-black hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 cursor-not-allowed'
              >
                <p className='w-1/2 text-center text-lg'>ARS$ {game.price}</p>
                <p className='w-1/2 h-full flex items-center select-none font-semibold justify-center text-center bg-blue-400'>¡You already own this game!</p>
              </div>
            </div>)
            :
            (<div>
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
            </div>)
          }
        </div>
      </section>

      <section className='mx-12'>
        <div className='w-[15rem] items-center flex bg-black'>
          <p className='w-1/2 h-full flex items-center justify-center text-center bg-blue-300'>Platform</p>
          <p className='w-1/2 text-center text-lg'>{game.platform.name}</p>
        </div>
        <p>Total Sales: {game.sales}</p>
      </section>

      <hr className='mx-12 mt-5 mb-10'/>

      <section className='w-12/12 flex flex-col items-center justify-center'>
        {isOwned && comment.enabled ? (
          <>
            <div className='w-10/12 mx-20'>
              <p className='px-5'>Add a review...</p>
              <form
                action={handlePostComment}
                className='w-10/12 m-5 mt-1 py-2 px-2 flex flex-col border-white border-2'
              >
                <div className='w-full'>
                  <textarea
                    name="comment"
                    placeholder='What did you think?'
                    value={comment.text}
                    onChange={(e) => handleCommentText(e.target.value)}
                    className='w-full mt-2 ml-4 bg-transparent outline-none resize-none'
                  />
                </div>
                <div
                  className='self-end flex'
                >
                  <div className='flex items-center bg-white text-black mr-6'>
                    <button
                      className='w-6 h-full hover:bg-slate-200'
                      value={comment.rating - 1}
                      onClick={handleRatingDown}
                    >
                      {`-`}
                    </button>
                    <p
                      className='border-white border-2'
                    >
                      {comment.rating}
                    </p>
                    <button
                      className='w-6 h-full hover:bg-slate-200'
                      value={comment.rating + 1}
                      onClick={handleRatingUp}
                    >
                      {`+`}
                    </button>
                  </div>
                  <button
                    className='py-2 px-4 bg-white text-black border-white border-2'
                    type='submit'
                  >
                    Comment
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <p>
            {!isOwned ? "You must own the game to post a review." : " You've already reviewed this game!"}
          </p>
        )}

        {reviews
          ? (
            <div className='w-10/12 mt-5'>
              {reviews.map((r, i) => {
                return (
                  <div
                    key={`review-${i}`}
                    className='flex w-full'
                  >
                    <div className='flex w-10/12 m-5 px-4 py-2 border-2 border-solid border-white'>
                      <div
                        className='flex flex-col items-center gap-2 mx-2 pr-5 my-2 border-r-white border-r-2'
                      >
                        <Image
                          src="/pfp.webp"
                          width={100}
                          height={100}
                          alt=''
                        />
                        <p>{r.user.name}</p>
                      </div>
                      <div className='w-full py-1'>
                        <div
                          className='w-full flex justify-between gap-4'
                        >
                          <div className='flex my-1'>

                            {Array(5).fill('').map((_, i) => {
                              if (i < r.rating) return (
                                <Image
                                  alt=''
                                  key={`star-${i}`}
                                  width={15}
                                  height={15}
                                  src={StarFilled}
                                />
                              )
                              else return (
                                <Image
                                  alt=''
                                  key={`star-${i}`}
                                  width={15}
                                  height={15}
                                  src={StarOutline}
                                />
                              )
                            })}
                          </div>

                        </div>
                        <p>
                          {r.comment}
                        </p>
                      </div>

                    </div>
                    <div className='flex min-w-40 mt-5 flex-col'>
                      <p>
                        posted: {toArgDate(r.createdAt)}
                      </p>
                      {
                        // r.updatedAt != r.createdAt
                        true
                          ? <p> edited: {toArgDate(r.updatedAt)} </p>
                          : null
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}

      </section>

    </article>
  );
}

export default Page;