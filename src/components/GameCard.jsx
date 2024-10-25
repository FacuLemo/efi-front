import React from 'react'

function GameCard({ game }) {
  return (

    <a href={`/tienda/${game.id}`} className="min-w-[30rem] block p-6 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-105 transition-all duration-150 ease-in-out">
      <div className='mb-2 border-b flex justify-between gap-5 items-center'>
        <h5 className="text-2xl font-bold tracking-tight text-white capitalize">{game.title}</h5>
        <p className='capitalize'>Available for {game.platform.name}</p>
      </div>

      <p className="capitalize font-normal text-gray-800 rounded-full bg-blue-300 inline-block px-2 mb-8">{game.genre.name}</p>
      <p className="text-2xl font-bold text-green-400 text-right">${game.price}</p>
    </a>

  )
}

export default GameCard