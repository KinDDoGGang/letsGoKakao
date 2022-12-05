const { Unauthorized } = require('./exception');
const { get } = require('./db/simple-db');

const auth = (req, res, next) => {
    const token = req.get('authorization');
    if(!token) {
        throw new Unauthorized();
    }

    const session = get('sessions', token);
    if(!session) {
        throw new Unauthorized();
    }

    req.username = session.username;
    next();
}

module.exports = auth;