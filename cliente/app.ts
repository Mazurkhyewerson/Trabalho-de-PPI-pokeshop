interface IPokemon {
  id: string;
  nome: string;
  tipo: string;
  preco: number;
  descricao: string;
  dataCadastro: string;
}

const form = document.getElementById('formCadastro') as HTMLFormElement;
const inputNome = document.getElementById('inputNome') as HTMLInputElement;
const inputTipo = document.getElementById('inputTipo') as HTMLSelectElement;
const inputPreco = document.getElementById('inputPreco') as HTMLInputElement;
const inputDescricao = document.getElementById('inputDescricao') as HTMLTextAreaElement;
const listaContainer = document.getElementById('listaContainer') as HTMLDivElement;

const URL_API: string = 'http://localhost:3000/pokemons';

function obterClasseTipo(tipo: string): string {
  return `tipo-${tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
}

function formatarPreco(preco: number): string {
  return `₽ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

async function carregarPokemons(): Promise<void> {
  listaContainer.innerHTML = `<div class="spinner"></div>`;
  try {
    const resposta = await fetch(URL_API);
    if (!resposta.ok) throw new Error('Erro ao buscar dados');
    const pokemons: IPokemon[] = await resposta.json();
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
  } catch {
    listaContainer.innerHTML = `<p style="color:red;">Erro de rede ao carregar a lista.</p>`;
  }
}

form.addEventListener('submit', async (evento: Event) => {
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
    } else {
      const erro = await resposta.json();
      alert(`Erro: ${erro.erro}`);
    }
  } catch {
    alert('Servidor offline!');
  }
});

carregarPokemons();