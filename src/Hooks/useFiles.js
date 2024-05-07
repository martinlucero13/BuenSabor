import { useMemo, useState } from "react"
import Resizer from "react-image-file-resizer";

export default function useFiles() {
    const [filesArray, setFilesArray] = useState([])
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)
    const [imageSrc, setImageSrc] = useState('')

    async function handleBase64(files) {
        let filesSet = new Set(filesArray)
        await Promise.all(
            files.map(async (file) => {
                /* const reader = new FileReader();
                reader.readAsDataURL(file); */
                const result = await resizeFile(file)
                if (!result.includes('data:image')) {
                    setError('Uno de los archivos seleccionados no es una imagen')
                    return
                }
                const readerBase64 = result.split("base64,");
                const image = {
                    name: file.name,
                    dataImage: readerBase64[1]
                }
                filesSet.add(image);
                setError('')
                /* await new Promise((resolve, reject) => {
                    reader.onload = function () {
                        if (!reader.result.includes('data:image')) {
                            setError('Uno de los archivos seleccionados no es una imagen')
                            return
                        }
                        const readerBase64 = reader.result.split("base64,");
                        const image = {
                            name: file.name,
                            dataImage: readerBase64[1]
                        }
                        filesSet.add(image);
                        setError('')
                        resolve()
                    }

                    reader.onerror = function (error) {
                        setError('Error al cargar la imagen')
                    }
                }) */
            })
        )
        const filesBase64 = Array.from(filesSet)
        setFilesArray(filesBase64)
    }

    const resizeFile = (file) => new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            900,
            900,
            "JPEG",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        )
    })

    const sizeInMbFiles = useMemo(() => {
        let totalSize = 0;

        filesArray.forEach(file => {
            totalSize += file.dataImage.length;
        })

        const sizeInMB = totalSize / (1024 * 1024);  // Convertir a MB
        if (sizeInMB > 20) {
            setError("El tamaño total no puede superar los 20mb")
        } else {
            setError("")
        }
        return sizeInMB
    }, [filesArray])

    function handleChange(e) {
        const { files } = e.target
        const filesArray = Object.values(files)
        handleBase64(filesArray)
    }

    function handleFilterImage(filter) {
        const filesArrayFilter = filesArray.filter(file => file !== filter)
        setFilesArray(filesArrayFilter)
    }

    function handleSelectImage(e) {
        const { currentSrc } = e.target
        setImageSrc(currentSrc)
        setShow(!show)
    }

    return {
        handleChange,
        handleFilterImage,
        handleSelectImage,
        setShow,
        show,
        filesArray,
        setFilesArray,
        imageSrc,
        error,
        sizeInMbFiles
    }
}
