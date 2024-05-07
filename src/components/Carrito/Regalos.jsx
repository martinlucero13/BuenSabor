export default function Regalos({ regalo }) {

    const url = `./${regalo.id}.jpg`
    return (
        <>
            <main>
                <img
                    src={url}
                    alt=""
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "./error.jpg"
                    }}
                />
                <article>
                    <h4>{regalo.descripcion}</h4>
                    <strong>REGALO - SE ENTREGA CUANDO SE RETIRAN LOS PRODUCTOS</strong>
                    <p>{regalo.disponible}</p>
                </article>
                {/* <div>
                    <button onClick={() => modificarCantidad(regalo.id, -1)}>-</button>
                    <p>{cantidad}</p>
                    <button onClick={() => modificarCantidad(regalo.id, 1)}>+</button>
                </div>
                <section>
                    <Trash style={{
                        color: 'red',
                        width: '25px',
                        height: '25px'
                    }}
                        onClick={() => deleteregalo(regalo.id)} />
                </section> */}
            </main>
            <style jsx>{`
                main{
                    width: 800px;
                    height: 100px;
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    border: 2px solid #cecaca;;
                    border-radius: 10px;
                    background-color: #fff;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                main img{
                    width: 80px;
                    height: 90%;
                    margin: 15px;
                    padding: 0;
                    border-radius: 10px;
                }
                main article{
                    flex-direction: column;
                    text-transform: uppercase;
                    padding: 10px;
                    margin-top: 15px;
                }
                main article h4{
                    font-weight: normal;
                    font-size:16px;
                    max-width: 420px;
                    width: 420px;
                }
                main article p{
                    margin-top: 3px;
                }
                main div{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                main div button{
                    margin: 5px;
                    padding: 0;
                    border-radius: 9999px;
                    width: 25px;
                    height: 25px;
                    background: none;
                    color: #000;
                    border: 2px solid #000;
                    font-weight: bold;
                    transition: 0.3s;
                }
                main div button:hover{
                    background-color: #e6e6e6;
                }
                main div p{
                    margin: 3px;
                    padding: 0;
                    font-size: 20px;
                    color: rgb(182, 27, 182);
                }
                main section{
                    height: 30px;
                    width: 30px;
                    margin-top: 5px;
                    margin-left: 40px;
                    cursor: pointer;
                }

                @media screen (max-width: 800px){
                    main{
                        display:flex;
                        width: 330px;
                        height: 350px;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    main section{
                        margin-top: 10px;
                        margin-left: 10px;
                        height: 30px;
                        width: 30px;
                    }
                    main article{
                    flex-direction: row;
                    text-transform: uppercase;
                    max-width: 100%;
                    padding: 0px;
                    margin-top: 15px;
                    }
                    main article{
                        text-align: center;
                    }
                    main article h4{
                        max-width: 100%;
                    }
                    main img{
                        width: 80px;
                        height: 30%;
                    }
                }
            `}</style>
        </>
    )
}
