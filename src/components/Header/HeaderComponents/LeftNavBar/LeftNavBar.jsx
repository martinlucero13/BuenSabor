import LeftBarList from './LeftBarList';


export default function LeftNavBar({ show, handleShow }) {


    return (
        <>
            <main onClick={handleShow}></main>
            <section>
                <LeftBarList handleShow={handleShow} show={show} />
            </section>
            <style jsx>{`
                main{
                    position:fixed;
                    width: 100vw;
                    height: 100vh;
                    left: 0;
                    top:0;
                    background-color: rgba(0, 0, 0, .3);
                    z-index: -1;
                    transition: all .5s;
                    opacity: ${show};
                    display: ${show ? 'flex' : 'none'};
                }
                section{
                    position:absolute;
                    left: 0;
                    top:0;
                    bottom:0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: start;
                    width: ${show ? '220px' : '0'};
                    height: 100vh;
                    color: white;
                    z-index: -1;
                    background-color: #E11919;
                    transition: all .5s;
                    opacity: ${show};
                   {/*  border-top: 8px white solid;
                    color: white;
                    border-bottom: 8px white solid; */}
                }
            `}</style>
        </>
    )
}
