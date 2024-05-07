import React, { useEffect } from 'react';
import useUser from '../src/Hooks/useUser';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function FourOhFour() {
    const { isLogged } = useUser()
    const navigate = useRouter()

    useEffect(() => {
        if (!isLogged) navigate.push('/')
    }, [isLogged])

    return (
        <>
            <div>
                <h1>404 - Page Not Found || </h1>
                <Link href='/home'>
                    <button>
                        Go back to home
                    </button>
                </Link>
            </div>
            <style jsx>{`
                div{
                    width: 100%;
                    height: 500px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }
                h1{
                    font-size: 50px;
                    font-weight: bold;
                }
                button{
                    border-radius: 20px;
                    background-color: rgb(182, 27, 182);
                    border: none;
                    padding: 10px;
                    font-size: 20px;
                    color: #FFF;
                    margin: 5px;
                    transition: 0.5s;
                }
                button:hover{
                    color: black;
                    background-color: rgb(182, 27, 182);
                }
            `}</style>
        </>
    )
}
