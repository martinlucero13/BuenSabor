import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: MercadoPagoDatos } = await api.post(`/mercadoPagoDatos/createMercadoPagoDatos`, fromData);
        res.statusCode = 200;
        res.json(MercadoPagoDatos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
