import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idPedido } = req.body;
        const { estado } = req.body;
        const { data: pedido } = await api.post(`/Productos/cambiarEstado?idPedido=${idPedido}&estado=${estado}`);
        res.statusCode = 200;
        res.json(pedido);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}