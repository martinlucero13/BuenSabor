


export default function ButtonLeftNavBar({ handleShow }) {


    return (
        <>
            <button onClick={handleShow}>
                <div></div>
                <div></div>
                <div></div>
            </button>
            <style jsx>{`
                button{
                    display:flex;
                    justify-content: center;
                    flex-direction: column;
                    width: 3rem;
                    height: 3rem;
                    border:0;
                    background: transparent;
                    gap: 0.65rem;
                    margin: 0 5px 0 5px;
                }
                button > div{
                    background-color: white;
                    height: 2px;
                    width: 100%;
                    border-radius: 5px;
                    transition: all .5s;
                    transform-origin: left;
                }
                button:hover div:first-child{
                    transform: rotate(45deg);
                }
                button:hover div:nth-child(2){
                    opacity: 0;
                }
                button:hover div:last-child{
                    transform: rotate(-45deg);
                }
            `}</style>
        </>
    )
}
