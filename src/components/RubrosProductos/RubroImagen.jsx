import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useFiles from "../../Hooks/useFiles";
import ShowImage from "./ShowImage";
import Loading from '../Loading/Loading'
import apiFeco from "../../Services/apiServices";
import UserContext from "../../context/userContext";


export default function RubroImagen({ handleShow, datoRow }) {
    const { user } = useContext(UserContext)
    const { handleChange,
        handleFilterImage,
        handleSelectImage,
        setShow,
        show,
        filesArray,
        imageSrc } = useFiles()
    const [disabledSend, setDisabledSend] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [transition, setTransition] = useState(false)

    useEffect(() => {
        handleCheck()
    }, [filesArray])

    useEffect(() => {
        // Después de que se haya realizado la animación, restablecer el estado de newItemAdded
        if (transition) {
            const timeoutId = setTimeout(() => {
                setTransition(false)
            }, 500) // Ajusta el tiempo de espera según la duración de tu transición CSS
            return () => clearTimeout(timeoutId)
        }
    }, [transition])

    function handleClick() {
        document.getElementById('files').value = "";
        document.getElementById('files').click();
    }

    async function handleSubmit() {
        setLoading(true)
        setError('')
        try {
            const dataToSend = {
                ...filesArray[0],
                denominacion: datoRow.denominacion
            }
            const { data: saveReintegrate } = await apiFeco.post('rubroProductos/saveImg', { fromData: dataToSend })
            if (saveReintegrate.statusCode === 200) {
                alert('Se guardaron los datos')
                setError('')
                handleShow()
            } else {
                throw new Error()
            }
        } catch (error) {
            setError('Error al guardar datos, intententelo nuevamente')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    function handleCheck() {
        if (filesArray.length === 0) {
            setDisabledSend(true)
            return
        }
        setDisabledSend(false)
    }



    return (
        <>
            {
                show &&
                <ShowImage
                    show={show}
                    setShow={setShow}
                    imageSrc={imageSrc}
                />
            }
            <main>
                <div>
                    <h2>Cargar Imagen</h2>
                    <h4>Denominacion: {datoRow ? datoRow.denominacion : ''}</h4>
                    <input onChange={handleChange} style={{ display: 'none' }} type="file" id="files" accept="image/png, image/jpeg, image/jpg" />

                    <button disabled={filesArray.length === 1} className={filesArray.length === 1 ? 'button_disabled' : 'button'} onClick={handleClick} >Seleccionar imagen</button>
                    {filesArray.length === 1 &&
                        <article>
                            <button onClick={() => handleFilterImage(filesArray[0])} className="buttonImage button">X</button>
                            <Image
                                src={`data:image/jpeg;base64,${filesArray[0].dataImage}`}
                                onClick={handleSelectImage}
                                width={100}
                                height={100}
                                alt="."
                            />
                        </article>
                    }
                    <section>
                        {
                            error &&
                            <strong>{error}</strong>
                        }
                        {
                            loading &&
                            <Loading
                                message='Guardando Imagen...'
                            />
                        }
                    </section>
                    <button onClick={handleSubmit} disabled={disabledSend} className={disabledSend || loading ? 'button_disabled' : 'button'}>Guardar</button>
                    <button onClick={handleShow} className='button'>Cancelar</button>
                </div>
            </main>
            <style jsx>{`
                main{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    padding:20px;
                }
                div{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    width: 320px;
                    padding: 10px;
                    transition: 0.5 ease;
                }
                label{
                    font-size: 15px;
                    font-weight: bold;
                    text-transform:uppercase;
                    margin-top: 5px;
                }
                .label-receta{
                    font-size: 13px;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-align: center;

                }
                input, select{
                    width: 220px;
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                }
                textArea{
                    width: 220px;
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                    resize: none;
                }
                .button{
                    margin-top: 10px;
                    background-color: rgb(138, 13, 111);
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 220px;
                    text-transform:uppercase;
                }
                .button_disabled{
                    margin-top: 10px;
                    transition: 0.5s;
                    background-color:grey;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 220px;
                    text-transform:uppercase;
                }
                button:hover{
                    color: black;
                }
                .button:hover{
                    color: black;
                    background-color: rgb(182, 27, 182);
                }
                .buttonImage{
                    position: absolute;
                    top: 0;
                    right: 0;
                    border-radius: 50px;
                    background-color: grey;
                    z-index: 1;
                    width: 25px;
                    height: 25px;
                    text-align: center;
                    cursor: pointer;
                    margin: 0;
                    padding: 0;
                }
                section{
                    display:flex;
                    flex-direction: column;
                    text-transform:uppercase;
                    text-align:center;
                    margin: 3px 0;
                }
                p{
                    margin:0;
                    font-size: 15px;
                    color:red;
                    text-transform:uppercase;
                    text-align: center;
                }
                strong{
                    text-transform:uppercase;
                    text-align: center;
                    color:red;
                }
                h2{
                    font-size: 27px;
                }
                article {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    background-color: rgb(167,167,167);
                    margin: 3px 0;
                }
                .element-hidden{
                    opacity: 0;
                }
                .element{
                    opacity: 1;
                    transition: opacity .7s ease;
                }
            `}
            </style>
        </>
    )
}
