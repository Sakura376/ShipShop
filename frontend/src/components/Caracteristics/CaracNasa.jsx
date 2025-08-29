import React from "react";
import "./Caracteristics.css";

const CaracNasa = () => {
  const caracteristicasNasa = [
    {
      titulo: "Durabilidad",
      descripcion: "Diseñadas para misiones largas y exigentes.",
      icono: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='icon icon-tabler icons-tabler-outline icon-tabler-shield'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3' />
        </svg>
      ),
    },
    {
      titulo: "Exploración Científica",
      descripcion: "Enfocadas en la investigación espacial avanzada.",
      icono: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='icon icon-tabler icons-tabler-outline icon-tabler-planet'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9c-.745 1.46 -5.783 -.259 -11.255 -3.838c-5.47 -3.579 -9.304 -7.664 -8.56 -9.123c.464 -.91 2.926 -.444 5.803 .805' />
          <path d='M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
        </svg>
      ),
    },
    {
      titulo: "Misiones Tripuladas",
      descripcion: "Capaces de soportar misiones con y sin astronautas.",
      icono: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='icon icon-tabler icons-tabler-outline icon-tabler-rocket'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3' />
          <path d='M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3' />
          <path d='M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
        </svg>
      ),
    },
  ];

  return (
    <div className='caracteristicas-nasa'>
      {caracteristicasNasa.map((caracteristica, index) => (
        <div className='tarjeta' key={index}>
          <div className='icono'>{caracteristica.icono}</div>
          <h3 className='c-title'>{caracteristica.titulo}</h3>
          <p className='c-description'>{caracteristica.descripcion}</p>
        </div>
      ))}
    </div>
  );
};

export default CaracNasa;
