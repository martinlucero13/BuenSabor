import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: Productos } = await api.post(`/rubroProductos/editRubroProductos`, fromData);
        res.statusCode = 200;
        res.json(Productos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
