"use client"
import React, { useState, useEffect, useRef } from 'react';

function DropDown({ selected, handler, units, label, placeholder = "Selecciona una opción", variable = "nombre", dark = false, }) {
  /*
  ejemplo de uso del componente:
    <DropDown
      selected={selectedUnidad}
      dark={true}
      handler={handleUnidadChange}
      units={unidades}
      label="Unidad de medida"
      placeholder="Selecciona una unidad de medida"
    />

    donde el handler es:
    const handleUnidadChange = (unit) => {
      setSelectedUnidad(unit.id);
    };
  */
  const basicDropdownRef = useRef(null);

  const [articleDropDown, setArticleDropDown] = useState(false);
  const [fullUnit, setFullUnit] = useState({});

  useEffect(() => {
    const selectedUnit = units.find(unit => unit.id === selected);
    if (selectedUnit) {
      setFullUnit(selectedUnit);
    }
  }, [selected, units]);

  const handleArticleDropDown = () => {
    setArticleDropDown(prevState => !prevState);
  };

  const handleSelectionChange = (unit) => {
    handler(unit);
    setFullUnit(unit);
    setArticleDropDown(false);
  };

  const handleClickOutside = (event) => {
    if (basicDropdownRef.current && !basicDropdownRef.current.contains(event.target)) {
      setArticleDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={basicDropdownRef} id={units.id} className="relative z-10">
      <div
        onClick={handleArticleDropDown}
        className={`inline-flex cursor-pointer items-center justify-center w-full px-4 py-2 text-sm font-medium 
                    ${!articleDropDown ? (dark ? "text-white" : "text-slate-700") : "text-white bg-slate-400"} 
                    ${dark ? "text-white hover:bg-slate-700 bg-slate-600" : "hover:text-white hover:bg-slate-400 border border-slate-400"} 
                    rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500`}
      >
        <span className="mr-2 text-lg">{fullUnit.nombre ? fullUnit.nombre : label}</span>
        <svg
          className={`w-5 h-5 ml-2 -mr-1`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div
        className={`${articleDropDown ? "" : "hidden"} absolute mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1`}
      >
        {placeholder &&
          <div className="block px-4 py-1 text-gray-600 hover:bg-gray-100 active:bg-blue-100 rounded-t-md">
            {placeholder}
          </div>
        }
        {units ? (
          units.map((unit) => (
            <div
              key={unit.id}
              className="block px-4 py-1 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
              onClick={() => handleSelectionChange(unit)}
            >
              {unit.nombre}
            </div>
          ))
        ) : (
          <div className="block px-4 py-2 text-gray-700 cursor-not-allowed rounded-md">
            No se encontraron resultados.
          </div>
        )}
      </div>
    </div>
  );
}

export default DropDown;
