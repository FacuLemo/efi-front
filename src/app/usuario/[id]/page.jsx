"use client"
import FetchData from '@/components/FetchData'
import GameCard from '@/components/GameCard';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

import React, { useState, useEffect, useContext, use } from 'react'

function Page(context) {
  const params = use(context.params),
    { id } = params,
    { user, token, authStatus } = useContext(AuthContext),
    [profile, setProfile] = useState(),
    [purchases, setPurchases] = useState(),
    [isSameUser, setIsSameUser] = useState(),
    router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const profileData = await FetchData(`users/${id}/`, token);
          setProfile(profileData);
          profileData.id == user.id ? setIsSameUser(true) : setIsSameUser(false)
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

  //GET HISTORIAL DE COMPRAS
  useEffect(() => {
    const fetchPurchases = async () => {
      if (token && isSameUser) {
        try {
          const profileHistory = await FetchData("purchases/", token);
          setPurchases(profileHistory)
        } catch (error) {
          console.error('Error loading purchases history', error);
        }
      }
    };
    if (authStatus === 'authenticated') {
      fetchPurchases();
    } else if (authStatus === 'unauthenticated') {
      router.push('/login');
    };
  }, [authStatus, token, isSameUser]);


  if (!profile) {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }
  return (
    <div className='text-center pt-8'>

      <div className='text-xl'>Bienvenido al perfil de </div>
      <div className='text-7xl mb-8 italic'> {profile.name}</div>

      <hr className='mx-28 ' />
      <p className='text-center text-3xl  pt-10 pb-5'>Historial de compras</p>

      {isSameUser ? (<div className='mx-0 md:mx-28 xl:mx-64 flex flex-col-reverse gap-10 justify-evenly pb-40'>
        {purchases?.length > 0 ? (
          purchases.map((purchase, index) => (
            <div key={index} className='w-full'>
              <GameCard game={purchase.game} />
              <p className='italic text-right'>Comprado el día {purchase.createdAt.split("T")[0] + " "}
                a las {purchase.createdAt.split("T")[1].split(".")[0]} por ${purchase.total}.</p>
            </div>
          ))
        ) : (
          (<div>
            <p className='text-xl '>¡Parece que no has comprado nada aún! </p>
            <a className='underline italic' href="/tienda">ir a la tienda</a>
          </div>
          )
        )}
      </div>) : <div>La biblioteca de {profile.name} es privada.</div>}

    </div>
  )
}

export default Page;
