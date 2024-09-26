const jwt = require('jsonwebtoken');
const JWT_SECRET  = 'bitroot';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'];
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).send({ message: 'Access Denied! Token not provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(403).send({ message: 'Invalid token!' });
        }
        req.user = decoded; 
        console.log("token verified !");
        next(); // Pass control to the next middleware or route handler
    });
};

module.exports = { authenticateToken };
