import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { CartFill } from 'react-bootstrap-icons';
import { useRouter } from 'next/router'

export default function navBarOut() {
    const navigate = useRouter()

    const handleNavigation = () => {
        navigate.push('/login');
    }
    return (
        <>
            <header>
                <nav className="navbar navbar-expand navbar-dark" id='fondo-nav1'>
                    <div className="container-fluid" id='fondo-nav2'>
                        <ul className="navbar-nav mx-auto">
                            <strong className="navbar-brand" href="#" width='50px' id='txtBS'>
                                <svg className="bi d-block mx-auto mb-1" width="24" height="24">
                                    <CartFill width="24" height="24"></CartFill>
                                </svg>
                                EL BUEN SABOR
                            </strong>
                        </ul>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        </div>
                        <div>
                            <button className="w-100 btn btn-lg btn-light mt-2" id='buttonIngresa' onClick={handleNavigation}>INGRESAR</button>
                        </div>
                    </div>
                </nav>
            </header>
            <style>{`
                #txtBS{
                mar
                }
                #fondo-nav2 {
                    background-color: #E11919;
                    height: 80px;
                }
                
                .fondo-nav2 {
                    background-color: #E11919;
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