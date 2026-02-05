import express from 'express';
import complaintRoutes from './routes/complaint.routes.js';
import logger from './middleware/loggger.middleware.js';

const app = express();


app.use(express.json());

app.use(logger);

app.use('/complaints', complaintRoutes);

app.get('/', (req, res) => {
    res.json({
        "message": "File a Complaint about Anime streaming services",
        "APIroutes": [
            "GET /complaints → Fetch all complaints",
            "POST /complaints → Create a new complaint",
            "PUT /  complaints/:id/resolve → Resolve a complaint",
            "DELETE /complaints/:id → Delete a complaint"
        ]
    });
});

export default app;
