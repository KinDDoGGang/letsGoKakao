const { get, set } = require('./db/simple-db');
const { BadRequest, BadCredential, NotMatchUserInfo } = require('./exception');
const { users} = require('./db/initial-data.json');

const TOKEN_LENGTH = 32;
const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
const createSimpleToken = () => {
    let token = '';
    for(let i = 0; i < TOKEN_LENGTH; i++) {
        token += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return token;
}

const saveSession = (user) => {
    const token = createSimpleToken();
    set('sessions', token, { username: user.id });
    return token;
}

const login = (req, res, next) => {
    const { username, password } = req.body;

    if(!(username && password)) {
        throw new BadRequest('사용자명 비밀번호는 필수 값입니다.');
    }

    const filteredUser = users.filter( (v, i) => v.id === username && v.password === password ) || [];

    if (filteredUser.length <= 0)
        throw new BadRequest('사용자명 혹은 비밀번호가 일치하지 않습니다.');


    const user = get('users', username);

    if(user) {
        res.json({
            token: saveSession(user)
            , username
            , status: 200
        })
    } else {
        throw new BadCredential();
    }
}

module.exports = login;