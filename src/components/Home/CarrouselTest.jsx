import Image from "next/image";
import { useState, useEffect } from "react";
import { CircleFill } from "react-bootstrap-icons"

const images = [
    {
        src: "/01.jpg"
    },
    {
        src: "/02.jpg"
    },
    {
        src: "/03.jpg"
    },
    /* {
        src: "/04.jpg"
    } */
]

export default function CarrouselTest() {
    const [imageIndex, setImageIndex] = useState(0)

    const totalImages = images.length
    const translateValue = -(imageIndex * (100 / totalImages))

    useEffect(() => {
        const timer = setTimeout(() => {
            handleChange(1)
        }, 5000);
        return () => clearTimeout(timer)
    }, [imageIndex])

    useEffect(() => {
        setImageIndex(0)
    }, [])

    function handleChange(number) {
        setImageIndex(imageIndex + number)
        if (imageIndex >= images.length - 1) {
            setImageIndex(0)
        }
    }

    return (
        <>
            <main>
                <div>
                    {images.map(image => (
                        <article key={image.src}>
                            <Image src={image.src}
                                key={image.src}
                                alt="..."
                                width={600}
                                height={600}
                            /* onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = "/error.jpg"
                            }} */
                            />
                        </article>
                    ))}
                </div>
                <section>
                    {images.map((image, index) => (
                        <button key={image.src} onClick={() => setImageIndex(index)}>
                            <CircleFill height={30} width={30} />
                        </button>
                    ))}
                </section>
            </main>
            <style jsx>{`
                main{
                    position:relative;
                    width:600px;
                    height: 600px;
                    background-color: white;
                    border: solid 2px grey;
                    border-radius: 20px;
                    overflow: hidden;
                }
                div{
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items:center;
                    width: calc(100% * ${images.length});
                    transition: all .5s ease;
                    transform: translateX(${translateValue}%);
                }
                article{
                    width: calc(100% / ${images.length});
                    height: 600px;
                }
                section{
                    display: flex;
                    justify-content: space-around;
                    position: absolute;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    margin: 0 5px 5px 5px;
                }
                button{
                    index: 1;
                    background: none;
                    border: none;
                    color: rgba(0,0,0, .3)
                }

                @media screen and (max-width: 652px){
                    main{
                        width: 300px;
                        height: 300px;
                    }
                    article{
                        height: 300px;
                    }
                }
            `}</style>
        </>
    )
}
