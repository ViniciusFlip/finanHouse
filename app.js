 
import {
    salvarLancamento,
    listarLancamentos,
    excluirLancamento,
    atualizarLancamento,
    
} from "./services/lancamentos/lancamentos.service.js";

import { loginGoogle, onAuthChange } from "./services/auth/auth.service.js";
import { getCategorias,categoriaExiste } from "./services/categorias/categorias.service.js";

console.log("cats",getCategorias());
let data=[];

let editandoId = null;


onAuthChange((user) => {

    if (user) {

        console.log("Usuário logado:");

        console.log(user);
        atualizarUsuario(user);

    } else {

        console.log("Nenhum usuário logado");

    }

});


function atualizarUsuario(user) {

    const nome = document.getElementById("user-name");
    const email = document.getElementById("user-email");
    const photo = document.getElementById("user-photo");

    if (!nome || !email || !photo) return;

    if (user) {

        photo.src = user.photoURL || "assets/img/avatar.png";

        nome.textContent = user.displayName || "Usuário";

        email.textContent = user.email || "";

    } else {

        photo.src = "assets/img/avatar.png";

        nome.textContent = "Não autenticado";

        email.textContent = "";

    }

}

async function testarLogin() {

    try {

        const user = await loginGoogle();

        console.log(user);

    } catch (error) {

        console.error(error);

    }

}

async function atualizarTela(){

    data = await listarLancamentos();

    render();

}


function atualizarDashboard() {

    let entradas = 0;
    let saidas = 0;

    data.forEach(item => {

        if (item.tipo === "entrada") {

            entradas += item.valor;

        } else {

            saidas += item.valor;

        }

    });

    const saldo = entradas - saidas;

    document.getElementById("entradas").innerHTML =
        `R$ ${entradas.toFixed(2)}`;

    document.getElementById("saidas").innerHTML =
        `R$ ${saidas.toFixed(2)}`;

    const saldoEl = document.getElementById("saldo");

    saldoEl.innerHTML =
        `R$ ${saldo.toFixed(2)}`;

    saldoEl.className =
        `text-3xl font-bold mt-2 ${
            saldo >= 0
                ? "text-blue-600"
                : "text-red-600"
        }`;

}


function cancelarEdicao() {

    editandoId = null;

    const input = document.getElementById("command");
    input.value = "";

    document.getElementById("btnAdicionar").textContent = "Adicionar";

    document.getElementById("btnCancelar").classList.add("hidden");

    input.focus();

}

function render() {

    const tbody = document.getElementById("tbody");

    tbody.innerHTML = "";

    data.forEach((item, index) => {

       const dataFormatada = item.createdAt
    ? item.createdAt.toDate().toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
      })
    : "--";

        console.log(item);

        tbody.innerHTML += `

<tr class="border-b border-gray-200 dark:border-gray-700">

<td class="p-3 dark:text-white">
    ${dataFormatada}
</td>

<td class="p-3">
<span class="${item.tipo==="entrada" ? "text-green-600" : "text-red-500"} font-semibold">
${item.tipo}
</span>
</td>

<td class="p-3 dark:text-white">
${item.categoria || "—"}
</td>

<td class="p-3 dark:text-white">
R$ ${item.valor.toFixed(2)}
</td>

<td class="p-3 dark:text-white">
    ${item.userName || "—"}
</td>

<td class="p-3 dark:text-white">
${item.descricao}
</td>
<td class="p-3 flex gap-2 justify-center">

<button
onclick="editar('${item.id}')"
class="bg-yellow-500 text-white px-3 py-1 rounded">
Editar
</button>

<button
onclick="remover('${item.id}')"
class="bg-red-600 text-white px-3 py-1 rounded">
Excluir
</button>

</td>

</tr>

`;

    });

    atualizarDashboard();

}
 async function adicionar() {

    const input = document.getElementById("command");

    const texto = input.value.trim();

    if (!texto) return;

    

const partes = texto.split(" ");

const tipo = partes[0].toLowerCase();
const valor = parseFloat(partes[1].replace(",", "."));
const categoria = partes[2];
const descricao = partes.slice(3).join(" ");

console.log({
    tipo,
    valor,
    categoria,
    descricao
});



    if (
        (tipo !== "entrada" && tipo !== "saida") ||
        isNaN(valor)
    ) {
        alert("Comando inválido");
        return;
    }

    if (!categoriaExiste(tipo, categoria)) {

    alert(
        `Categoria "${categoria}" não encontrada para ${tipo}.`
    );

    return;

}
    if (editandoId) {

        await atualizarLancamento(editandoId, {
              tipo,
                valor,
                categoria,
                descricao
        });

        editandoId = null;
        document.getElementById("btnAdicionar").textContent = "Adicionar";
        document.getElementById("btnCancelar").classList.add("hidden");
    } else {

        await salvarLancamento(
             tipo,
                valor,
                categoria,
                descricao
        );

    }

    input.value = "";

    await atualizarTela();

}
async function remover(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este lançamento?"
    );

    if (!confirmar) return;

    await excluirLancamento(id);

    await atualizarTela();

}

function editar(id) {

    const lancamento = data.find(item => item.id === id);

    if (!lancamento) return;

    const input = document.getElementById("command");

    input.value = `${lancamento.tipo} ${lancamento.valor} ${lancamento.descricao}`;

    editandoId = id;
    const botao = document.getElementById("btnAdicionar");

    botao.textContent = "Salvar alterações";
    document.getElementById("btnCancelar").classList.remove("hidden");
    input.focus();

}

document.getElementById("btnAdicionar")
.addEventListener("click",adicionar);

document.getElementById("command")
.addEventListener("keypress",(e)=>{

if(e.key==="Enter")
adicionar();

});

document.getElementById("themeBtn")
.addEventListener("click",()=>{

document.documentElement.classList.toggle("dark");

});

(async () => {
    await atualizarTela();
})();

(async () => {

    const lancamentos = await listarLancamentos();

    console.log(lancamentos);

})();
window.adicionar = adicionar;
window.editar = editar;
window.remover = remover;
window.cancelarEdicao = cancelarEdicao;


window.testarLogin = testarLogin;