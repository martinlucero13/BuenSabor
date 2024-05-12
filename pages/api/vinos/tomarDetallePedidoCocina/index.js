import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idPedido } = req.body;
        const { data: pedidos } = await api.get(`/Productos/tomarDetallePedidoCocina?idPedido=${idPedido}`);
        res.statusCode = 200;
        res.json(pedidos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}