"use client"
import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';


function Home() {
  const { authStatus, user } = useContext(AuthContext);
  if (authStatus === 'loading') {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }

  return (
    <div>
      <div className='text-center text-5xl py-10'>
        Welcome to Steam!
      </div>
      <div className=' flex text-center text-xl w-full justify-center py-10'>
        {
          user ? (
            <div className='flex flex-col w-full md:w-1/4'>
              <p>
                Welcome back <a href={`/usuario/${user?.id}`}>{user?.name}</a>!
              </p>
              <a className="my-3 rounded-lg shadow border bg-gray-800 border-gray-700 hover:bg-gray-700" href='/tienda'>
                Go to Store
              </a>
            </div>
          ) : (
            <div className='flex flex-col w-full md:w-1/4'>
              <p>
                It looks that you are not logged in.
              </p>
              <a className="my-2 rounded-lg shadow border bg-gray-800 border-gray-700 hover:bg-gray-700" href='/login'>
                Log in now
              </a>
              <a className='text-sm' href='/register'>
                Don't have an account? Create one.
              </a>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Home;