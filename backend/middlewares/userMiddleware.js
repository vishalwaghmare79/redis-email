const jwt = require('jsonwebtoken');

const requireSignIn = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' }); 
    }
};

module.exports = { requireSignIn }