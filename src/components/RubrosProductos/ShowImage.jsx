import Image from "next/image";

export default function ShowImage({ show, setShow, imageSrc }) {
    return (
        <>
            <main>
                <div>
                    <button onClick={() => setShow(!show)}>Cerrar</button>
                    <Image
                        width={600}
                        height={600}
                        src={imageSrc}
                        alt='viaticImage'
                    />
                </div>
            </main>
            <style jsx>{`
            main {
                    position: fixed;
                    width: 100vw;
                    height: 100vh;
                    left: 0;
                    top: 0;
                    background-color: rgba(0, 0, 0, .3);
                    z-index: 2;
                    transition: all .5s;
                    opacity: ${show};
                    display: ${show ? 'flex' : 'none'};
                    margin-top: 55px;
                    align-items: center;
                    justify-content: center;
                }
                div {
                    border: 2px solid grey;
                    border-radius: 20px;
                    width: 600px;
                    height: 600px;
                    overflow:hidden;
                }
                button {
                    margin: 10px;
                    padding: 5px;
                    border-radius: 50px;
                    width: 180px;
                    color: #fff;
                    background-color:#E11919;
                    border:none;
                    transition: 0.3s;
                    position:absolute;
                    top: 7%;
                    right: 1%;
                    width: 100px;
                    margin: 0;
                }
                button:hover {
                    color: black;
                    background-color: #FF0000;
                }
                @media and screen (max-width: 600px){
                    div {
                        width: 350px;
                        height: 350px;
                    }
                    .buttonClose {
                        top: 8%;
                    }
                }
                `}</style>
        </>
    )
}
