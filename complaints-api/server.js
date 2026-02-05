import express from 'express';

const app = express()

app.get('/', (req, res) => {
    res.json({
        "message": "File a Complaint about Anime streaming services",
        "APIroutes": `GET /complaints → Fetch all complaints (Public)
                      POST /complaints → Create a new complaint (Public)
                      PUT /complaints/:id/resolve → Resolve a complaint (Protected)
                      DELETE /complaints/:id → Delete a complaint (Protected)`
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})