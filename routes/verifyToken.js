const { func } = require('@hapi/joi');
const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).json({message: 'Access Denied'});

    jwt.verify(token,'myStrongSecret123', (err, user) =>{
        if(err) return res.status(401).json({message: 'Access Denied'});
        req.user = user;
        next();
    });
}