const API_URL = "/api/Suporte";

var chatAberto = false;
var intervaloAtualizacao = null;
var isLoadingMensagens = false;   // <-- trava contra requisições simultâneas

function toggleChat() {
    var janela = document.getElementById("janelaChat");
    var badge = document.getElementById("chatBadge");

    if (chatAberto) {
        // FECHANDO O CHAT
        janela.classList.add("d-none");
        chatAberto = false;
        clearInterval(intervaloAtualizacao);

        // Volta a verificar notificações
        verificarNotificacoes();
    } else {
        // ABRINDO O CHAT
        janela.classList.remove("d-none");
        chatAberto = true;

        // Esconde o badge imediatamente
        if (badge) badge.classList.add("d-none");

        // Carrega mensagens e marca como lidas
        carregarMensagensSeguro();
        atualizarContadorLidas();

        // Atualiza o chat a cada 10 segundos (reduz carga no servidor)
        intervaloAtualizacao = setInterval(() => {
            carregarMensagensSeguro();
            atualizarContadorLidas();
        }, 10000);   // <-- antes era 5000

        setTimeout(() => {
            const input = document.getElementById("msgInput");
            if (input) input.focus();
        }, 100);
    }
}

// Wrapper que impede requisições simultâneas
async function carregarMensagensSeguro() {
    if (isLoadingMensagens) return;
    isLoadingMensagens = true;
    await carregarMensagens();
    isLoadingMensagens = false;
}

async function carregarMensagens() {
    try {
        const response = await fetch(`${API_URL}/historico`);

        if (!response.ok) {
            console.warn("Usuário possivelmente não autenticado ou rota inexistente.");
            return;
        }

        const mensagens = await response.json();
        renderizarMensagens(mensagens);

    } catch (error) {
        console.error("Erro ao carregar chat:", error);
    }
}

function renderizarMensagens(lista) {
    const chatBody = document.getElementById("chatBody");
    if (!chatBody) return;

    chatBody.innerHTML = "";

    if (!lista || lista.length === 0) {
        chatBody.innerHTML = '<p class="text-center text-muted small mt-5">Olá! Como podemos ajudar hoje?</p>';
        return;
    }

    // Renderiza apenas as últimas 50 mensagens para evitar travamento
    const ultimas = lista.slice(-50);

    ultimas.forEach(msg => {
        const isAdmin = msg.respondidoPorAdmin;

        const divRow = document.createElement("div");
        divRow.className = isAdmin ? "msg-row msg-admin" : "msg-row msg-me";

        const divBala = document.createElement("div");
        divBala.className = "msg-bala shadow-sm";
        divBala.innerText = msg.texto;

        const smallHora = document.createElement("div");
        smallHora.className = "text-end mt-1";
        smallHora.style.fontSize = "0.6rem";
        smallHora.style.opacity = "0.7";
        const data = new Date(msg.dataEnvio);
        smallHora.innerText = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        divBala.appendChild(smallHora);
        divRow.appendChild(divBala);
        chatBody.appendChild(divRow);
    });

    chatBody.scrollTop = chatBody.scrollHeight;
}

async function enviarMensagem(e) {
    e.preventDefault();
    const input = document.getElementById("msgInput");
    const texto = input.value.trim();

    if (!texto) return;

    input.value = "";

    try {
        const payload = {
            texto: texto,
            destinatarioId: 0
        };

        const response = await fetch(`${API_URL}/enviar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Recarrega o chat e atualiza contador (sem sobrecarregar)
            await carregarMensagensSeguro();
            atualizarContadorLidas();
        } else {
            console.error("Falha ao enviar mensagem.");
        }

    } catch (error) {
        console.error("Erro no envio:", error);
    }
}

// --- SISTEMA DE NOTIFICAÇÕES (BADGE) ---

async function verificarNotificacoes() {
    // Se o chat já estiver aberto, não precisa mostrar badge
    if (chatAberto) return;

    try {
        const response = await fetch(`${API_URL}/notificacoes`);
        if (response.ok) {
            const totalAdminNoServer = await response.json();

            const lidasLocal = parseInt(localStorage.getItem('msgsAdminLidas') || '0');
            const naoLidas = totalAdminNoServer - lidasLocal;

            const badge = document.getElementById("chatBadge");
            if (badge) {
                if (naoLidas > 0) {
                    badge.innerText = naoLidas;
                    badge.classList.remove("d-none");
                    badge.classList.add("animate__animated", "animate__bounceIn");
                } else {
                    badge.classList.add("d-none");
                }
            }
        }
    } catch (e) {
        // Silencia erro
    }
}

async function atualizarContadorLidas() {
    try {
        const response = await fetch(`${API_URL}/notificacoes`);
        if (response.ok) {
            const total = await response.json();
            localStorage.setItem('msgsAdminLidas', total);
        }
    } catch (e) { }
}

// Inicia as notificações (verifica a cada 15 segundos para aliviar o servidor)
document.addEventListener("DOMContentLoaded", () => {
    verificarNotificacoes();
    setInterval(verificarNotificacoes, 15000);   // <-- antes 10000
});