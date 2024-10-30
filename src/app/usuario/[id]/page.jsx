"use client"
import FetchData from '@/components/FetchData'
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext, use } from 'react'

function Page(context) {
  const params = use(context.params),
    { id } = params,
    { user, token, authStatus} = useContext(AuthContext),
    [profile, setProfile] = useState(),
    router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const profileData = await FetchData(`users/${id}/`, token);
          setProfile(profileData);
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

  }, [id, authStatus, token, user]);

  if (!profile) {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }

  return (
    <div className='text-center pt-8'>

      <div className='text-xl'>Bienvenido al perfil de </div>
      <div className='text-7xl mb-8 italic'> {profile.name}</div>

      <hr className='mx-28 '/>

      {/* Agregar acá la biblioteca del usuario */}
    </div>
  )
}

export default Page;
