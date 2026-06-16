import express, { Request, Response } from 'express';
import cors from 'cors';

export interface IPokemon {
  id: string;
  nome: string;
  tipo: string;
  preco: number;
  descricao: string;
  dataCadastro: string;
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pokemons: IPokemon[] = [
  {
    id: "1710000000001",
    nome: "Charizard",
    tipo: "Fogo",
    preco: 4500,
    descricao: "Pokémon Chama poderoso. Suas chamas atingem 1400°C. Ideal para treinadores experientes.",
    dataCadastro: new Date().toISOString()
  },
  {
    id: "1710000000002",
    nome: "Vaporeon",
    tipo: "Água",
    preco: 2800,
    descricao: "Evolução aquática de Eevee. Pode dissolver-se na água e nadar sem ser detectado.",
    dataCadastro: new Date().toISOString()
  },
  {
    id: "1710000000003",
    nome: "Gengar",
    tipo: "Fantasma",
    preco: 3200,
    descricao: "Pokémon Sombra noturna. Adora se esconder nas sombras e pregar sustos. Raramente dócil.",
    dataCadastro: new Date().toISOString()
  }
];

app.get('/pokemons', (req: Request, res: Response) => {
  res.status(200).json(pokemons);
});

app.post('/pokemons', (req: Request, res: Response) => {
  const { nome, tipo, preco, descricao } = req.body;

  if (!nome || !tipo || preco === undefined || !descricao || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ 
      erro: "Todos os campos são obrigatórios e o preço deve ser um número positivo." 
    });
  }

  const novoPokemon: IPokemon = {
    id: Date.now().toString(),
    nome: String(nome),
    tipo: String(tipo),
    preco: Number(preco),
    descricao: String(descricao),
    dataCadastro: new Date().toISOString()
  };

  pokemons.push(novoPokemon);
  res.status(201).json(novoPokemon);
});

app.listen(PORT, () => {
  console.log(`[Back-end] Servidor PokéShop rodando com sucesso na porta ${PORT}`);
});