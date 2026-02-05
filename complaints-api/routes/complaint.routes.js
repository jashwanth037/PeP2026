import express from 'express';

const router = express.Router();

const complaints = []

router.get("/", (req, res) => {
    res.send(complaints);
});

router.push

export default router;