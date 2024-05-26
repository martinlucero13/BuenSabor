import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: clientes } = await api.post(`/usersCol/createUsuario`, fromData);
        res.statusCode = 200;
        res.json(clientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
