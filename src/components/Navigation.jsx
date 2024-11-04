"use client"
import React, { useEffect, useState, useContext } from 'react';
import DropDown from './DropDown';
import { useRouter } from "next/navigation";
import { AuthContext } from '@/contexts/AuthContext';


export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter()
  const { user, logout } = useContext(AuthContext);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavbar = (unit) => {
    router.push(unit.id)
  };


  const handleLogOff = () => {
    logout();  
    router.push('/login');
  };

  return (

    <header className="z-50 fixed top-0 w-full">
      <nav className="p-5 shadow md:flex md:items-center md:justify-between bg-slate-800 z-50">
        <div className="flex justify-between items-center z-50">
          <span className="text-2xl font-[Poppins] text-white cursor-pointer z-50">
            <a href="/">
              <svg width="35" height="35" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
              </svg>
            </a>
          </span>

          <span className="text-3xl cursor-pointer mx-2 md:hidden block z-50" onClick={handleMenuClick}>
            <a>
              {
                menuOpen ? (
                  <svg width="35" height="35" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                  </svg>
                ) : (
                  <svg width="35" height="35" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                  </svg>
                )
              }
            </a>
          </span>
        </div>

        <ul className={`md:flex md:items-center md:static absolute w-full [&>li>a]:text-xl [&>li>a]:w-full [&>li>a]:transition-all [&>li>a]:duration-200
                            left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 z-50  ${menuOpen ? "opacity-100 top-[80px] bg-slate-800" : "opacity-0 top-[-400px]"}
                            transition-all ease-in duration-[400ms] [&>li]:mx-4 [&>li]:my-6 [&>li]:md:my-0`}>

          <li className='z-40 relative'>

            <DropDown
              dark={true}
              handler={handleNavbar}
              units={[
                { id: "/tienda", nombre: "Store" },
                { id: "/carrito", nombre: "Cart" },
                { id: "/carga-juego", nombre: "Add" },
              ]}
              label="Store Options"
              placeholder={false}
            />

          </li>

          <li className='z-10 relative'>
            <DropDown
              dark={true}
              handler={handleNavbar}
              units={[
                { id: `/usuario/${user?.id}`, nombre: `${user?.name}` },
              ]}
              label="My Profile"
              placeholder={false}
            />
          </li>

          <li className='border-none'>
            <button
              className="p-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
              onClick={handleLogOff}
            >
              Log off
            </button>
          </li>

        </ul>
      </nav>
    </header>


  );
}