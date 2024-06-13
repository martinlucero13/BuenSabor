import api from "../../../../src/Services/api"


export default async function handler(req,res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getUltimoProducto } = await api.get(`/Productos/getUltimoProducto`);
        res.statusCode = 200;
        res.json(getUltimoProducto);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
