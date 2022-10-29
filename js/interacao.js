// =========== login e entrada ao chat ===========

let nomeDoUsuario = "";
let nomeParaEnvio = {nome: ""};
function entrarNaSala(){
    nomeDoUsuario = document.querySelector(".secaoDeLogin input").value;

    if (nomeDoUsuario ===''){return alert("Escreva um nome")}
    else if (nomeDoUsuario.length <=3){return alert("Escreva um nome com mais de 3 caracteres")}
    else{
        nomeParaEnvio = {name: nomeDoUsuario};

        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeParaEnvio);

        promise.then(usuarioValido);
        promise.catch(usuarioInvalido);
    }
}

function usuarioValido(){
    setInterval(manterOnline, 5000)

    const tirarAreaDeLogin = document.querySelector('.secaoDeLogin');
    tirarAreaDeLogin.classList.add('invisivel');

    carregarMensagensDoServidor()
}
function manterOnline(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeParaEnvio);
}
function usuarioInvalido(erro){
    console.log(erro)
    if(erro.response.status === 400){alert("usuário existente")}
    else {alert("Verifique sua conexão a internet e tente novamente em alguns instantes!")}
}

// ======== processamento de mensagem do servidor =========

let mensagens = [];
function carregarMensagensDoServidor() {
    
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(respostaChegou);
}
function problemasComAsMensagens(){
    alert("Possível problema com o Servidor, por favor verifique sua internet e tente novamente em 10 segundos!")
}

function respostaChegou(resposta) {
    mensagens = resposta.data;

    paraACaixaDeMensagens()
}

function paraACaixaDeMensagens() {

    const areaDasMensagens = document.querySelector(".bandeijaDeMensagem");
    areaDasMensagens.innerHTML = "";

    for (i=0; i<mensagens.length - 1; i++) {
        let mensagem = mensagens[i];

        areaDasMensagens.innerHTML += `
        <div class="mensagem flex aling">
            <span class="spanPrincipal">
                <span class="horas">${mensagem.time}</span>
                <span class="nomeUsuario">${mensagem.from}</span>
                <span class="to">para <strong>${mensagem.to}:</strong></span>
                <span class="mensagemUsuario">${mensagem.text}</span>
            </span>
        </div>  
        `;
    };

    const ultimoElementoDeMensagem = document.querySelectorAll(".mensagem");
    ultimoElementoDeMensagem[ultimoElementoDeMensagem.length - 1].scrollIntoView()

    usuariosOnline();
    setTimeout(carregarMensagensDoServidor, 3000);  
}

// ======================== enviar mensagem =============================

let mensagemDoUsuario = "";
let mensagemParaEnvio = {from:"",to:"",text:"",type:"",time:""};
function enviarMensagem(){
    mensagemDoUsuario = document.querySelector(".barraInf input").value;
    mensagemParaEnvio = {
        "from": nomeDoUsuario,
        "to": "Todos",
        "text": mensagemDoUsuario,
        "type": "message",
    }
    mensagemDoUsuario = "";

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemParaEnvio);
    promise.then(carregarMensagensDoServidor);
    promise.catch(problemasComAsMensagens);

    carregarMensagensDoServidor();
}

// ====================== Usuários onlines ======================

function ativarAbaDeOpcoes(){
    const classeDaAba = document.querySelector(".secaoDeOpcoes");
    classeDaAba.classList.toggle("invisivel");
}

let usuarios = [];
function usuariosOnline() {

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(listaDeUsuarios)
}
function listaDeUsuarios(resposta){
    usuarios = resposta.data
    apresentarUsuariosOnline()
}

function apresentarUsuariosOnline() {
    const areaDeUsuariosOnline = document.querySelector(".listaContatos");
    areaDeUsuariosOnline.innerHTML = "";

    for (i=0; i<usuarios.length - 1; i++) {
        let usuario = usuarios[i].name;

        areaDeUsuariosOnline.innerHTML += `
        <li>
            <div class="pessoa flex aling just-b online">
                <div class="nome flex aling">
                    <ion-icon name="person-circle"></ion-icon>
                    <span>${usuario}</span>
                </div>
                <div class="on">
                    <ion-icon name="checkmark-outline"></ion-icon>
                </div>
            </div>
        </li>
        `;
    };

    //usuarios = []
}