import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { CartFill } from 'react-bootstrap-icons';

export default function navBarOut() {
    return (
        <>
            <header>
                <nav className="navbar navbar-expand navbar-dark" id='fondo-nav1'>
                    <div className="container-fluid" id='fondo-nav2'>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mx-auto">
                                <strong className="navbar-brand" href="#" width='50px'>
                                    <svg className="bi d-block mx-auto mb-1" width="24" height="24">
                                        <CartFill width="24" height="24"></CartFill>
                                    </svg>
                                    LOGEARSE EL BUEN SABOR
                                </strong>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <style>{`
                #fondo-nav2 {
                    background-color: rgb(138, 13, 111);
                    height: 80px;
                }
                
                .fondo-nav2 {
                    background-color: rgb(138, 13, 111);
                    border: 0px;
                    color: white;
                    pointer-events: default;
                }
                
                #fondo-nav1 {
                    background-color: white;
                }
            `}</style>
        </>
    )
}