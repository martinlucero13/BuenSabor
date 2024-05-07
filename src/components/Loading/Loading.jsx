import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import Fecoicon from './Fecoicon'

export default function Loading({ message, i, fontSize, marginLeft, marginRight, marginLeftIcon }) {
  return (
    <>
      <div key={i} className='loading-div'>
        <strong style={{ fontSize: `${fontSize}px`, marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px` }}>{message ? message : 'Cargando datos...'}</strong>
        <Fecoicon className={`loading ${marginLeftIcon ? marginLeftIcon : 'ms-5'} m-2`} width='80'></Fecoicon>
      </div>
      <style>{`
            .loading {
                animation-name: rotation;
                animation-duration: 10s;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
              }
              
              @keyframes rotation {
                0% {
                  transform: rotate(0deg);
                }
              
                100% {
                  transform: rotate(360deg);
                }
              }
              
              .loading {
                width: 80px;
              }
              .loading-div{
                max-width: 200px;
                align-items: center;
              }
            `}</style>
    </>
  )
}
