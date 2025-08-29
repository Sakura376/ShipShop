import React from "react";
import "./Caracteristics.css";

const CaracSpaceX = () => {
  const caracteristicasSpaceX = [
    {
      titulo: "Reutilización",
      descripcion: "Cohetes que se pueden usar varias veces.",
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
          className='icon icon-tabler icons-tabler-outline icon-tabler-recycle'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M12 17l-2 2l2 2' />
          <path d='M10 19h9a2 2 0 0 0 1.75 -2.75l-.55 -1' />
          <path d='M8.536 11l-.732 -2.732l-2.732 .732' />
          <path d='M7.804 8.268l-4.5 7.794a2 2 0 0 0 1.506 2.89l1.141 .024' />
          <path d='M15.464 11l2.732 .732l.732 -2.732' />
          <path d='M18.196 11.732l-4.5 -7.794a2 2 0 0 0 -3.256 -.14l-.591 .976' />
        </svg>
      ),
    },
    {
      titulo: "Aterrizaje Vertical",
      descripcion: "Tecnología avanzada de aterrizaje controlado.",
      icono: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='icon icon-tabler icons-tabler-outline icon-tabler-jetpack'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M10 6a3 3 0 1 0 -6 0v7h6v-7z' />
          <path d='M14 13h6v-7a3 3 0 0 0 -6 0v7z' />
          <path d='M5 16c0 2.333 .667 4 2 5c1.333 -1 2 -2.667 2 -5' />
          <path d='M15 16c0 2.333 .667 4 2 5c1.333 -1 2 -2.667 2 -5' />
          <path d='M10 8h4' />
          <path d='M10 11h4' />
        </svg>
      ),
    },
    {
      titulo: "Comercialización",
      descripcion: "Acceso comercial a los vuelos espaciales.",
      icono: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='icon icon-tabler icons-tabler-outline icon-tabler-briefcase'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z' />
          <path d='M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2' />
          <path d='M12 12l0 .01' />
          <path d='M3 13a20 20 0 0 0 18 0' />
        </svg>
      ),
    },
  ];

  return (
    <div className='caracteristicas-spacex'>
      {caracteristicasSpaceX.map((caracteristica, index) => (
        <div className='tarjeta' key={index}>
          <div className='icono'>{caracteristica.icono}</div>
          <h3 className='c-title'>{caracteristica.titulo}</h3>
          <p className='c-description'>{caracteristica.descripcion}</p>
        </div>
      ))}
    </div>
  );
};

export default CaracSpaceX;
