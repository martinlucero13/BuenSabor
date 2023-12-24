import api from "../../../Services/api"

export default async function handler(req: any, res: any) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { username, password } = req.body;
        const { data: token } = await api.post('/login', { username, password});
        res.statusCode = 200;
        res.json(token);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}

