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
    setInterval(manterOnline, 5000);

    const momentoDeCarregamento = document.querySelector(".login");
    momentoDeCarregamento.classList.add("invisivel");
    const momentoDeCarregamento2 = document.querySelector(".carregamento");
    momentoDeCarregamento2.classList.remove('invisivel');

    setInterval(tirarAreaDeLogin, 5000);
    

    carregarMensagensDoServidor()
}
function tirarAreaDeLogin(){
    const tirarAreaDeLogin = document.querySelector('.secaoDeLogin');
    tirarAreaDeLogin.classList.add('invisivel');
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

        if (mensagem.text === "entra na sala..." || mensagem.text === "sai da sala..."){
            areaDasMensagens.innerHTML += `
                <div class="mensagem flex aling entraNaSala">
                    <span class="spanPrincipal">
                        <span class="horas">${mensagem.time}</span>
                        <span class="nomeUsuario">${mensagem.from}</span>
                        <span class="to">para <strong>${mensagem.to}:</strong></span>
                        <span class="mensagemUsuario">${mensagem.text}</span>
                    </span>
                </div>  
            `;
        }
        else if (mensagem.to === nomeDoUsuario || mensagem.to === usuarioEscolhidoParaPv){
            if(mensagem.type === "private_message"){
                areaDasMensagens.innerHTML += `
                <div class="mensagem flex aling mensagemPrivada">
                    <span class="spanPrincipal">
                        <span class="horas">${mensagem.time}</span>
                        <span class="nomeUsuario">${mensagem.from}</span>
                        <span class="to">para <strong>${mensagem.to}:</strong></span>
                        <span class="mensagemUsuario">${mensagem.text}</span>
                    </span>
                </div>  
            `;
            }
            else {
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
            }
        }
        else if (mensagem.to === "Todos"){
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
        }
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

    const verificaSePublicoOuPrivada = document.querySelector('.marcada').querySelector('span').innerHTML;

    mensagemParaEnvio = {
        "from": nomeDoUsuario,
        "to": "Todos",
        "text": mensagemDoUsuario,
        "type": "message",
    }
    
    if (usuarioEscolhidoParaPv !== "") {
        if (verificaSePublicoOuPrivada !== "Público"){
            mensagemParaEnvio.to = usuarioEscolhidoParaPv;
            mensagemParaEnvio.type = "private_message"
            processaAMensagem(mensagemParaEnvio)
        }
        else {
            mensagemParaEnvio.to = usuarioEscolhidoParaPv;
            processaAMensagem(mensagemParaEnvio)
        }
    }
    else {processaAMensagem(mensagemParaEnvio)}

}

function processaAMensagem(mensagemParaEnvio){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemParaEnvio);
        promise.then(carregarMensagensDoServidor);
        promise.catch(problemasComAsMensagens);

        mensagemDoUsuario = "";
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
    promise.then(listaDeUsuarios);
    
    if (usuarioEscolhidoParaPv !== null && usuarioEscolhidoParaPv !== ""){
        usuarioEscolhidoParaPv = usuarioAnterior.querySelector('span').innerHTML
    }
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
            <div onclick="mensagemParaEsteUsuario(this)" class="pessoa flex aling just-b">
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

    usuarios = []

}

// ===================== privatizar uma mensagem ============
let usuarioEscolhidoParaPv = "";
let usuarioAnterior = "";
function mensagemParaEsteUsuario(aqui) {
    const elementosOnline = document.querySelector(".online");
    

    if (usuarioAnterior === ""){
        if (elementosOnline !== null){
            elementosOnline.classList.remove("online");
            aqui.classList.add('online');
            usuarioAnterior = aqui;
            usuarioEscolhidoParaPv = aqui.querySelector('span').innerHTML;
    }
        aqui.classList.add('online');
        usuarioAnterior = aqui;
        usuarioEscolhidoParaPv = aqui.querySelector('span').innerHTML;
    }
    else if(usuarioAnterior === aqui){
        elementosOnline.classList.remove("online");
        aqui.classList.remove("online");
        usuarioAnterior = "";
        usuarioEscolhidoParaPv = "";
    }
    else {
        if (elementosOnline === null){
            aqui.classList.add('online');
            usuarioEscolhidoParaPv = aqui.querySelector('span').innerHTML;
            usuarioAnterior = "";
        }
        elementosOnline.classList.remove("online")
        aqui.classList.add('online');
        usuarioEscolhidoParaPv = aqui.querySelector('span').innerHTML;
        usuarioAnterior = "";
    }
}

// ================= controlando se é privada ou pública =========

function publicoOuPrivado(aqui){
    const tipoSelecionada = document.querySelector('.marcada');

    if (aqui.querySelector('span').innerHTML !== tipoSelecionada.querySelector('span').innerHTML){
        tipoSelecionada.classList.remove('marcada')
        aqui.classList.add('marcada')
    }
}   