let nomeDoUsuario = "";
let nomeParaEnvio = {nome: ""};
function entrarNaSala(){
    nomeDoUsuario = document.querySelector("input").value;
    nomeParaEnvio = {name: nomeDoUsuario};

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeParaEnvio);

    promise.then(usuarioValido);
    promise.catch(usuarioInvalido);
}

function usuarioValido(resposta){
    console.log("usuário valido");
    setInterval(manterOnline, 5000)
}
function manterOnline(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeParaEnvio);
}
function usuarioInvalido(erro){
    if(erro.response.status === 400){console.log("usuário existente")}
    else {console.log("é outro problema")}
}