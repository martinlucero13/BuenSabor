import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idUsuario } = req.body;
        const { data: cliente } = await api.put(`/clientes/deleteCliente?idUsuario=${idUsuario}`);
        res.statusCode = 200;
        res.json(cliente);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
