const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. No token provided or invalid format."
        });
    }

    const token = authHeader.split(' ')[1];


    if (token === 'secure_token_123') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

export default authMiddleware;
