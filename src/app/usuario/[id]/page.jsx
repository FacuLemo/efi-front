"use client"
import FetchData from '@/components/FetchData'
import { AuthContext } from '@/contexts/AuthContext';
import React, { useState, useEffect, useContext, use } from 'react'

function Page(context) {
  const params = use(context.params),
    { id } = params,
    { token, authStatus } = useContext(AuthContext),
    [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const userData = await FetchData(`users/${id}/`, token);
          setUser(userData);
        } catch (error) {
          console.error('Error loading user data', error);
        }
      }
    };

    if (authStatus === 'authenticated') {
      fetchData();
    } else if (authStatus === 'unauthenticated') {
      router.push('/login');
    }

  }, [id, authStatus, token]);

  if (!user) {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }

  return (
    <div className='text-center pt-8'>

      <div className='text-xl'>Bienvenido al perfil de </div>
      <div className='text-7xl mb-8 italic'> {user.name}</div>

      <hr className='mx-28 '/>

      {/* Agregar acá la biblioteca del usuario */}
    </div>
  )
}

export default Page;
