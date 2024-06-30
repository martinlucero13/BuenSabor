import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idUsuario } = req.body;
        const { data: getDomicilio } = await api.get(`/clientes/getDomicilio?idUsuario=${idUsuario}`);
        res.statusCode = 200;
        res.json(getDomicilio);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
