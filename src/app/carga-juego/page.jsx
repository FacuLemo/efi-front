"use client"
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PostData from '@/components/PostData';
import FetchData from '@/components/FetchData';
import DropDown from '@/components/DropDown';

function CreateGameForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [userRole, setUserRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const { token, authStatus, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (token && user) {
        
        const userRole = await FetchData(`users/${user.id}`, token)
        if (userRole.roleId == 1) { router.push('/') }

        const dataGenres = await FetchData('genres', token);
        const dataPlatforms = await FetchData('platforms', token);
        setGenres(dataGenres);
        setPlatforms(dataPlatforms);
      }
    };

    if (authStatus === 'authenticated') {
      fetchData();
    } else if (authStatus === 'unauthenticated') {
      router.push('/');
    }

  }, [authStatus, token]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      price,
      genreId: selectedGenre.id,
      platformId: selectedPlatform.id
    };

    console.log(JSON.stringify(payload, null, 2))

    try {
      await PostData('games', payload, token);
      alert('Juego creado exitosamente');
      setTitle('');
      setPrice('');
      setSelectedGenre(null);
      setSelectedPlatform(null);
    } catch (error) {
      alert('Hubo un error al crear el juego');
    }
  };

  if (authStatus === 'loading') {
    return <p className='text-3xl font-semibold animate-pulse text-center p-20'>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='m-5'>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          className="text-gray-800 p-1 rounded mx-2"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className='m-5'>
        <label htmlFor="price">Precio</label>
        <input
          id="price"
          className="text-gray-800 p-1 rounded mx-2"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className='relative z-30 m-5'>
        <label>Género</label>
        <DropDown
          selected={selectedGenre?.id}
          handler={handleGenreChange}
          units={genres.map(genre => ({ ...genre, nombre: genre.name }))}
          label={selectedGenre ? selectedGenre.name : "Selecciona un género"}
          variable="name"
          dark={true}
        />

      </div>

      <div className='relative z-20 m-5'>
        <label>Plataforma</label>
        <DropDown
          selected={selectedPlatform?.id}
          handler={handlePlatformChange}
          units={platforms.map(platform => ({
            ...platform, nombre: platform.name,
          }))}
          label={selectedPlatform ? selectedPlatform.name : "Selecciona una plataforma"}
          variable="name"
          dark={true}
        />

      </div>

      <button className='m-5 p-2 rounded text-white font-bold bg-blue-300' type="submit">Crear Juego</button>
    </form>
  );
}

export default CreateGameForm;
