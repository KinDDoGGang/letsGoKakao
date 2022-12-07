require('cross-fetch/polyfill')

async function APIRequest(target) {
    if (target === 'login') {
        const call =  fetch("http://127.0.0.1:8080/login", 
                        { 
                            method: "post", 
                            headers: { "content-type": "application/json" }, 
                            body: JSON.stringify({username : 'brilliant', password: 'brilliant'}), 
                        }
                    ).then((res) => res.json());

        return new Promise( resolve => resolve(call));
    }
}

async function APIAuthRequest(api, methodType, params, token) {
    const data = {
        method: methodType,
        headers: {
          "content-type": "application/json",
          "Authorization": token,
        },
    };
    
    if (methodType === "POST") {
        data.body = JSON.stringify(params);
    }
  
    const call = fetch(api, data).then((res) => res.json())
       
    return new Promise( resolve => resolve(call));
}


module.exports = {
    APIRequest, APIAuthRequest
}