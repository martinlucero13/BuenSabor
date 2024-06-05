import api from "../../../src/Services/api"
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb'
        },
        /* responseLimit: false, */
    },
}
export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: absentDay } = await api.post(`/StockProductos/saveImg`, fromData);
        res.statusCode = 200;
        res.json(absentDay);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
