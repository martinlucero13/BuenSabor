import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { legajo } = req.body;
        const { data: reintegrateList } = await api.get(`/viaticosColaboradores/getReintegrate?legajo=${legajo}`);
        res.statusCode = 200;
        res.json(reintegrateList);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
