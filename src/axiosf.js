import axios from 'axios';
export default axi
function axi(url, method, params) {
    return new Promise(function (resolve, reject) {       
            axios({
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'charset': 'utf-8',
                    'Access-Control-Allow-Headers': '*',
                    'ReferrerPolicy': "unsafe-url"},
                url: 'http://api.dinorush.businessmod.ru/' + url,
                data: {
                    "jsonrpc": "2.0",
                    "id": time(),
                    "method": method,
                    "params": params
                },
                responseType: 'json', 
                referrerPolicy: "unsafe-url", 
            })
                .then((res) => {
                    console.log(res)
                    resolve(res.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });  
};  
    