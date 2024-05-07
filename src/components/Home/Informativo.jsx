

export default function Informativo() {

    return (
        <>
            <main>
                <img src="./10.jpg"
                    alt="..."
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "./error.jpg"
                    }}
                />
                <img src="./11.jpg"
                    alt="..."
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "./error.jpg"
                    }}
                />
            </main>
            <style jsx>{`
                main{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                img{
                    width: 600px;
                    height: 280px;
                    padding: 2px;
                    margin: 20px;
                    background-color: grey;
                    border-radius: 10px;
                    /* transition: transform 0.4s; */
                }
                /* img:hover{
                    transform: scale(1.1);
                } */
                @media screen and (max-width: 652px){
                    img{
                        width: 300px;
                        height: 180px;
                        margin: 20px;
                    }
                }
            `}</style>
        </>
    )
}
