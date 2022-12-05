class Exception {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}

class BadRequest extends Exception {
    constructor(message) {
        super(message, 400);
    }
}

class BadCredential extends Exception {
    constructor() {
        super('올바르지 않은 username 또는 password입니다.', 401);
    }
}


class Unauthorized extends Exception {
    constructor() {
        super('로그인이 필요합니다.', 401);
    }
}

class NotFound extends Exception {
    constructor(id) {
        super(`리소스를 찾을 수 없습니다. id=${id}`, 404);
    }
}

class Forbidden extends Exception {
    constructor(message) {
        super(message, 403);
    }
}

module.exports = {
    BadRequest, BadCredential, Unauthorized, NotFound, Forbidden
}