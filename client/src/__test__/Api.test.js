const { APIRequest } = require('./api')

let token = undefined;

it('mock api login test', async () => {
    const response = await APIRequest('login')

    expect(response.status).toEqual(200);
    expect(response.username).toEqual('brilliant')

    token = response.token;
})

it()