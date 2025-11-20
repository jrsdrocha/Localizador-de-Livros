<!-- Banner -->
<p align="center">
  <img src="https://img.shields.io/badge/Projeto-Localizador%20de%20Livros-blue?style=for-the-badge" />
</p>

<h1 align="center">📚 Localizador de Livros – Biblioteca com Navegação A*</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completo-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Linguagem-JavaScript-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/Estilo-CSS-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Framework-TailwindCSS-teal?style=flat-square" />
  <img src="https://img.shields.io/badge/Algoritmo-A*%20Pathfinding-red?style=flat-square" />
</p>

---

## 🧠 Sobre o Projeto

Este sistema é uma aplicação web que simula a **localização de livros dentro de uma biblioteca física**, exibindo:

- 🗺️ Um mapa com estantes, ruas e avenidas  
- 🤖 Cálculo de rotas usando o algoritmo **A\***
- 👣 Animação mostrando o percurso até o livro desejado
- 🧭 Rota alternativa automática caso não exista caminho disponível
- 📱 Interface moderna, responsiva e dinâmica

O sistema serve como um **protótipo funcional de navegação indoor**, ideal para universidades, bibliotecas e apresentações acadêmicas.

---

## 🚀 Funcionalidades

### 🔐 Login
- Tela inicial com autenticação simples  
- Credenciais padrão:
  - Matrícula: `unifor`
  - Senha: `2025`

### 📚 Busca de Livros
- Lista carregada localmente  
- Exibe:
  - Detalhes da obra  
  - Botão para iniciar a navegação até o local

### 🗺️ Visualização da Biblioteca
- Grid 17×17 com:
  - Estantes
  - Corredores
  - Cruzamentos
- Tooltip interativa ao passar o mouse  
- Renderização automatizada

### 🧭 Algoritmo A*
- Busca do melhor caminho em matriz
- Heurística: **Manhattan**
- Bloqueio automático de estantes
- Fallback em forma de **rota em L** caso o A* falhe

### 🎯 Animação do Caminho
- Rota desenhada via SVG  
- Marcador móvel representando o usuário  

---

## 📁 Estrutura do Projeto
/
├── index.html → Container principal da aplicação
├── style.css → Estilos e animações
└── app.js → Lógica, telas e algoritmo A*


---

## 🧩 Tecnologias & Recursos Utilizados

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura base da interface |
| **CSS + Tailwind** | Estilização e responsividade |
| **JavaScript** | Controle de telas, mapa e A* |
| **SVG Render** | Desenho da rota animada |

---

## 📷 Demonstração Visual

### 🛣️ Renderização do Mapa

- Estantes numeradas automaticamente  
- Cruzamentos nomeados  
- Ícones e tooltips interativos

### 🎬 Animação

- Marcador simula a caminhada do usuário  
- Linhas animadas acompanhando o percurso

---

## 🔧 Como Executar

1️⃣ Baixe ou clone o repositório  

```bash
git clone https://github.com/seu-usuario/localizador-biblioteca.git



