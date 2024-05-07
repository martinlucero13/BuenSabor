import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idUsuario } = req.body;
        const { data: getPerfil } = await api.get(`/clientes/getPerfil?idUsuario=${idUsuario}`);
        res.statusCode = 200;
        res.json(getPerfil);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
