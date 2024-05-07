import { useContext } from 'react';
import PedidoContext from '../../../../Context/pedidoContext';
import UtilityContext from '../../../../Context/utilityContext';
import UserContext from '../../../../context/userContext';
import BarListItem from './BarListItem';
import { listPages, listPagesAdministrador, listPagesCocinero, listPagesDelivery, listPagesCajero, listPagesCliente } from '../../../../data';
import Head from 'next/head';

export default function LeftBarList({ show, handleShow }) {
    const { articulos } = useContext(PedidoContext)
    const { setMarca } = useContext(UtilityContext)
    const { user } = useContext(UserContext)

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap" rel="stylesheet" />
            </Head>
            <main>
                <>
                    {user.USROL === '5' ? (
                        listPagesAdministrador.map(itemPage => (
                            <BarListItem
                                key={itemPage.title}
                                title={itemPage.title}
                                iconData={itemPage.iconData}
                                show={show}
                                handleShow={handleShow}
                            />
                        ))
                    ) : user.USROL === '4' ? (
                        listPagesCocinero.map(itemPage => (
                            <BarListItem
                                key={itemPage.title}
                                title={itemPage.title}
                                iconData={itemPage.iconData}
                                show={show}
                                handleShow={handleShow}
                            />
                        ))
                    ) : user.USROL === '3' ? (
                        listPagesDelivery.map(itemPage => (
                            <BarListItem
                                key={itemPage.title}
                                title={itemPage.title}
                                iconData={itemPage.iconData}
                                show={show}
                                handleShow={handleShow}
                            />
                        ))
                    ) : user.USROL === '2' ? (
                        listPagesCajero.map(itemPage => (
                            <BarListItem
                                key={itemPage.title}
                                title={itemPage.title}
                                iconData={itemPage.iconData}
                                show={show}
                                handleShow={handleShow}
                            />
                        ))
                    ) : user.USROL === '1' ? (
                        listPagesCliente.map(itemPage => (
                            <BarListItem
                                key={itemPage.title}
                                title={itemPage.title}
                                iconData={itemPage.iconData}
                                show={show}
                                handleShow={handleShow}
                            />
                        ))
                    ) : (
                        listPages.map(itemPage => (
                            <BarListItem
                                key={itemPage.title}
                                title={itemPage.title}
                                iconData={itemPage.iconData}
                                show={show}
                                handleShow={handleShow}
                            />
                        ))
                    )}
                </>
                {user &&
                    <section>
                        <article>
                            {user.USNOMUSU} {user.USAPEUSU}
                        </article>
                    </section>
                }
                <div>
                    <p>EL PLACER DE COMER BIEN</p>
                </div>
            </main>
            <style jsx>{`
                main{
                    display: ${show ? 'flex' : 'none'};
                    list-style: none;
                    flex-direction: column;
                    align-items: start;
                    padding: 10px;
                    width:100%;
                    height:100%;
                    overflow-y:auto;
                    margin-top:90px;
                }
                section{
                    display:flex;
                    width: 100%;
                    text-align: center;
                    display: none;
                    margin: 10px 0 0 0;
                    padding: 0;
                }
                div{
                    margin-top: 10px;
                    text-align: center;
                    text-transform: uppercase;
                }
                div p{
                    font-family: 'Caveat', cursive;
                }
                main::-webkit-scrollbar {
                    width: 8px;
                }
                main::-webkit-scrollbar-thumb {
                    border-radius: 9999px;
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                    background-color: grey;
                    border: 1px solid #000;
                }
                main::-webkit-scrollbar-track {
                    border: 1px solid #000;
                    padding: 2px 0;
                    background-color: #404040;
                }
                
                @media screen and (max-width: 575px){
                    section{
                        display: block;
                    }
                    section::after{
                        display:flex;
                        align-items:start;
                        justify-content:flex-start;
                        content: "";
                        width: 100%;
                        height: 2px;
                        margin-top: 20px;
                        border-radius: 10px;
                        background-color:grey;
                        bottom:0;
                        left:0;
                    }
                }
            `}</style>
        </>
    )
}
