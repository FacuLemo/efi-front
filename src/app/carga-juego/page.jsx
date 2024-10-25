"use client"
import React, { useState, useEffect } from 'react';
import PostData from '@/components/PostData';
import FetchData from '@/components/FetchData';
import DropDown from '@/components/DropDown';

function CreateGameForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpZCI6MSwibmFtZSI6InZhbGVuIiwiZW1haWwiOiJ2YWxAZW4uY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaFdqS0JCWFZiUnJhMW1sb0Y4U1ZPdTlpM2ZPOXVEMmZGY0t4cGNUdjM2bXZ4S002Q2J3d3UiLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJyb2xlSWQiOjIsIlJvbGUiOnsiaWQiOjIsIm5hbWUiOiJST0xFX0FETUlOIn19LCJpYXQiOjE3Mjk3NDMxMTh9.C_X50u91LLHPQaOfC411I7ozV0kRaOYIlMCAINGrR54"

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await FetchData('genres', token);
      setGenres(data);
    };
    const fetchPlatforms = async () => {
      const data = await FetchData('platforms', token);
      setPlatforms(data);
    };
    fetchGenres();
    fetchPlatforms();
  }, []);

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
