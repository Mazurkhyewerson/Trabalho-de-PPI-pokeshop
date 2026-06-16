"use strict";
const form = document.getElementById('formCadastro');
const inputNome = document.getElementById('inputNome');
const inputTipo = document.getElementById('inputTipo');
const inputPreco = document.getElementById('inputPreco');
const inputDescricao = document.getElementById('inputDescricao');
const listaContainer = document.getElementById('listaContainer');
const URL_API = 'http://localhost:3000/pokemons';
function obterClasseTipo(tipo) {
    return `tipo-${tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
}
function formatarPreco(preco) {
    return `₽ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}
async function carregarPokemons() {
    listaContainer.innerHTML = `<div class="spinner"></div>`;
    try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok)
            throw new Error('Erro ao buscar dados');
        const pokemons = await resposta.json();
        listaContainer.innerHTML = '';
        if (pokemons.length === 0) {
            listaContainer.innerHTML = `<p>Nenhum Pokémon na loja.</p>`;
            return;
        }
        pokemons.forEach((pokemon) => {
            const card = document.createElement('div');
            card.className = 'card-pokemon';
            card.innerHTML = `
        <span class="badge-tipo ${obterClasseTipo(pokemon.tipo)}">${pokemon.tipo}</span>
        <h3 class="pokemon-nome">${pokemon.nome}</h3>
        <p>${pokemon.descricao}</p>
        <div class="pokemon-preco">${formatarPreco(pokemon.preco)}</div>
        <div class="pokemon-data">Cadastrado: ${new Date(pokemon.dataCadastro).toLocaleDateString('pt-BR')}</div>
      `;
            listaContainer.appendChild(card);
        });
    }
    catch {
        listaContainer.innerHTML = `<p style="color:red;">Erro de rede ao carregar a lista.</p>`;
    }
}
form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const cargaUtil = {
        nome: inputNome.value.trim(),
        tipo: inputTipo.value,
        preco: Number(inputPreco.value),
        descricao: inputDescricao.value.trim()
    };
    try {
        const resposta = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cargaUtil)
        });
        if (resposta.status === 201) {
            form.reset();
            await carregarPokemons();
        }
        else {
            const erro = await resposta.json();
            alert(`Erro: ${erro.erro}`);
        }
    }
    catch {
        alert('Servidor offline!');
    }
});
carregarPokemons();
