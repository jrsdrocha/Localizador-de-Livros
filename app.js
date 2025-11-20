/* -------------------------
   Estado & DOM
   ------------------------- */
let currentScreen = 'login';
let selectedBookIndex = 0;
let currentStartPoint = { row: 0, col: 0 }; // entrada por padrão
let lastBookLocation = { row: 0, col: 0 };

const validMatricula = 'unifor';
const validSenha = '2025';

const appContainer = document.getElementById('app-container');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

/* -------------------------
   Map & books
   ------------------------- */
const mapData = {
    ruas: ['Rua Lima Barreto', 'Rua Machado de Assis', 'Rua Clarice Lispector', 'Rua Eça de Queiroz', 'Rua Jorge Amado', 'Rua José Saramago', 'Rua Fernando Pessoa', 'Rua Cora Coralina', 'Rua Guimarães Rosa'],
    avenidas: ['Av. Lygia F. Telles', 'Av. Luís Vaz de Camões', 'Av. Cecília Meireles', 'Av. Graciliano Ramos', 'Av. Ariano Suassuna', 'Av. Vinicius de Moraes', 'Av. Manuel Bandeira', 'Av. Rachel de Queiroz', 'Av. Mia Couto'],
    shelfRowCount: 8, shelfColCount: 8
};

const mockBooks = [
    { id: 0, title: "Engenharia de Software", author: "Ian Sommerville", edition: "10ª Edição", shelfNumber: 39, roadIndex: 4, address: "Estante 39, Lado A, Prateleira P3, na Rua Jorge Amado.", copies: { disponivel: 2, emprestado: 5, reservado: 1 } },
    { id: 1, title: "Cem Anos de Solidão", author: "Gabriel García Márquez", edition: "Edição Especial", shelfNumber: 1, roadIndex: 0, address: "Estante 01, Lado B, Prateleira P1, na Rua Lima Barreto.", copies: { disponivel: 1, emprestado: 0, reservado: 0 } },
    { id: 2, title: "A Metamorfose", author: "Franz Kafka", edition: "Clássico", shelfNumber: 64, roadIndex: 8, address: "Estante 64, Lado A, Prateleira P5, na Rua Guimarães Rosa.", copies: { disponivel: 0, emprestado: 1, reservado: 3 } },
    { id: 3, title: "Dom Casmurro", author: "Machado de Assis", edition: "Clássico Nacional", shelfNumber: 12, roadIndex: 1, address: "Estante 12, Lado A, Prateleira P2, na Rua Machado de Assis.", copies: { disponivel: 4, emprestado: 1, reservado: 0 } },
    { id: 4, title: "Vidas Secas", author: "Graciliano Ramos", edition: "Edição de Bolso", shelfNumber: 50, roadIndex: 6, address: "Estante 50, Lado B, Prateleira P4, na Rua José Saramago.", copies: { disponivel: 0, emprestado: 3, reservado: 2 } },
    { id: 5, title: "Código Limpo", author: "Robert C. Martin", edition: "Tradução Oficial", shelfNumber: 27, roadIndex: 3, address: "Estante 27, Lado A, Prateleira P3, na Rua Eça de Queiroz.", copies: { disponivel: 3, emprestado: 1, reservado: 0 } },
    { id: 6, title: "Padrões de Projeto", author: "Erich Gamma, et al.", edition: "GoF", shelfNumber: 60, roadIndex: 7, address: "Estante 60, Lado B, Prateleira P5, na Rua Fernando Pessoa.", copies: { disponivel: 1, emprestado: 5, reservado: 0 } },
    { id: 7, title: "O Programador Pragmático", author: "Andrew Hunt, David Thomas", edition: "20º Aniversário", shelfNumber: 33, roadIndex: 4, address: "Estante 33, Lado A, Prateleira P1, na Rua Jorge Amado.", copies: { disponivel: 2, emprestado: 0, reservado: 0 } },
    { id: 8, title: "Grande Sertão: Veredas", author: "Guimarães Rosa", edition: "Capa Dura", shelfNumber: 8, roadIndex: 0, address: "Estante 08, Lado B, Prateleira P3, na Rua Lima Barreto.", copies: { disponivel: 7, emprestado: 3, reservado: 1 } },
    { id: 9, title: "Algoritmos: Teoria e Prática", author: "Cormen, Leiserson, Rivest, Stein", edition: "4ª Edição", shelfNumber: 55, roadIndex: 6, address: "Estante 55, Lado A, Prateleira P2, na Rua José Saramago.", copies: { disponivel: 5, emprestado: 2, reservado: 1 } }
];

/* -------------------------
   Ícones inline (SVG) — uso direto para melhor qualidade
   ------------------------- */
const userSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="#fff"/><path d="M3 20.5C3 16.357 7.03 13 12 13s9 3.357 9 7.5v.5H3v-.5z" fill="#fff"/></svg>`;
const bookSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 3H7.5A2.5 2.5 0 0 0 5 5.5V19" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* -------------------------
   Utilitários: coordenadas e células
   ------------------------- */
function calculateShelfCoordinates(shelfNumber) {
    const shelfIndex = shelfNumber - 1; // 0..63
    const shelfRowIndex = Math.floor(shelfIndex / mapData.shelfColCount);
    const shelfColIndex = shelfIndex % mapData.shelfColCount;
    return { row: (shelfRowIndex * 2) + 1, col: (shelfColIndex * 2) + 1 };
}
function getShelfNumberFromCoords(coords) {
    if (coords.row % 2 === 0 || coords.col % 2 === 0) return 0;
    const sr = (coords.row - 1) / 2, sc = (coords.col - 1) / 2;
    return (sr * mapData.shelfColCount) + sc + 1;
}

/* -------------------------
   A* pathfinding
   - walkable: any cell that is NOT shelf (i.e., not odd-odd)
   - 4-directional
   ------------------------- */
class PQueue { constructor() { this._ = [] } push(i, p) { this._.push({ i, p }); this._.sort((a, b) => a.p - b.p); } pop() { return this._.shift()?.i; } empty() { return this._.length === 0 } }
function isWalkable(r, c) { if (r < 0 || c < 0 || r > 16 || c > 16) return false; if ((r % 2 !== 0) && (c % 2 !== 0)) return false; return true; }
function neighbors(n) { const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; const out = []; for (const d of dirs) { const nr = n.r + d[0], nc = n.c + d[1]; if (isWalkable(nr, nc)) out.push({ r: nr, c: nc }); } return out; }
function key(n) { return `${n.r}-${n.c}`; }
function heur(a, b) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c); }

function aStar(start, goal) {
    const open = new PQueue();
    open.push(start, 0);
    const came = {};
    const g = {}; g[key(start)] = 0;
    const f = {}; f[key(start)] = heur(start, goal);

    while (!open.empty()) {
        const cur = open.pop();
        const ck = key(cur);
        if (cur.r === goal.r && cur.c === goal.c) {
            const path = []; let curK = ck;
            while (curK) {
                const [rr, cc] = curK.split('-').map(Number);
                path.push({ r: rr, c: cc });
                curK = came[curK];
            }
            return path.reverse();
        }
        for (const nb of neighbors(cur)) {
            const nbk = key(nb);
            const tentative = g[ck] + 1;
            if (g[nbk] === undefined || tentative < g[nbk]) {
                came[nbk] = ck;
                g[nbk] = tentative;
                f[nbk] = tentative + heur(nb, goal);
                open.push(nb, f[nbk]);
            }
        }
    }
    return null;
}

/* -------------------------
   Telas: login / search / route
   ------------------------- */
function renderLoginScreen() {
    appContainer.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-3">Localizador de Livros</h1>
      <p class="text-center text-gray-500 mb-6">Credenciais de teste: <strong>unifor</strong> / <strong>2025</strong></p>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <label class="block text-gray-700">Matrícula</label>
        <input id="matricula" class="w-full p-2 border rounded mt-1" placeholder="unifor"/>
        <label class="block text-gray-700 mt-3">Senha</label>
        <input id="senha" type="password" class="w-full p-2 border rounded mt-1" placeholder="2025"/>
        <div id="login-error" class="text-red-500 mt-2 hidden"></div>
        <button id="login-button" class="w-full bg-indigo-600 text-white py-2 rounded mt-4">Entrar</button>
      </div>
    </div>
  `;
    document.getElementById('login-button').addEventListener('click', handleLogin);
}

function renderSearchScreen() {
    const current = mockBooks[selectedBookIndex];
    const startLabel = (currentStartPoint.row === 0 && currentStartPoint.col === 0) ? 'Entrada Principal' : `Estante E${getShelfNumberFromCoords(currentStartPoint)}`;

    appContainer.innerHTML = `
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800">Pesquisar Livro</h2>
      <div class="mt-3 p-3 bg-slate-50 rounded">
        <strong>Seu Ponto A:</strong> ${startLabel}
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <label class="block text-gray-700">Livro</label>
          <select id="book-select" class="w-full p-2 border rounded mt-1">
            ${mockBooks.map((b, i) => `<option value="${i}" ${i === selectedBookIndex ? 'selected' : ''}>${b.title} — ${b.author}</option>`).join('')}
          </select>
          <div class="mt-3 flex gap-2">
            <button id="search-book-button" class="bg-green-600 text-white py-2 px-3 rounded">Detalhes</button>
            <button id="generate-route-button" class="bg-blue-600 text-white py-2 px-3 rounded">Gerar Trajeto</button>
          </div>
        </div>

        <div id="selected-book-info" class="p-3 border rounded">
          <div class="text-sm text-gray-700">Livro selecionado</div>
          <div class="text-lg font-bold text-indigo-600">${current.title}</div>
          <div class="text-sm text-gray-500">${current.author}</div>
        </div>
      </div>

      <div id="legend" class="legend mt-4"></div>
    </div>
  `;

    document.getElementById('book-select').addEventListener('change', e => {
        selectedBookIndex = parseInt(e.target.value, 10);
        const b = mockBooks[selectedBookIndex];
        document.getElementById('selected-book-info').innerHTML = `<div class="text-sm text-gray-700">Livro selecionado</div><div class="text-lg font-bold text-indigo-600">${b.title}</div><div class="text-sm text-gray-500">${b.author}</div>`;
    });

    document.getElementById('search-book-button').addEventListener('click', showBookDetails);
    document.getElementById('generate-route-button').addEventListener('click', () => { currentScreen = 'route'; renderApp(); });

    // legenda
    const legend = document.getElementById('legend');
    legend.innerHTML = `
    <div class="item"><div class="user-marker" style="width:22px;height:22px">${userSvg}</div><div>Você</div></div>
    <div class="item"><div class="dest-marker" style="width:22px;height:22px">${bookSvg}</div><div>Destino</div></div>
    <div class="item"><div style="width:18px;height:18px;border-radius:4px;background:linear-gradient(90deg,#2563eb,#60a5fa)"></div><div>Rota</div></div>
    <div class="item"><div style="width:18px;height:18px;border-radius:6px;background:#e6ccb0"></div><div>Estante</div></div>
  `;
}

function renderRouteScreen() {
    const book = mockBooks[selectedBookIndex];
    appContainer.innerHTML = `
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold">Trajeto para o livro: ${book.title}</h2>

      <div id="map-wrapper" class="mt-4">
        <div id="map-container"></div>
        <svg id="route-svg" preserveAspectRatio="none"></svg>
        <div id="route-tracker" class="route-tracker" style="display:none"></div>
        <div id="cell-tooltip" class="cell-tooltip"></div>
      </div>

      <div class="mt-3 text-center">
        <button id="concluir-pesquisa-button" class="bg-green-600 text-white py-2 px-4 rounded mr-2">Concluir</button>
        <button id="back-to-search-button" class="bg-gray-500 text-white py-2 px-4 rounded">Voltar</button>
      </div>
    </div>
  `;
    //PONTO DE PARADA.
    
    drawLibraryMapAndRoute(book);

    document.getElementById('concluir-pesquisa-button').addEventListener('click', showFinalPopup);
    document.getElementById('back-to-search-button').addEventListener('click', () => { currentScreen = 'search'; renderApp(); });
}

/* -------------------------
   Modal / detalhes do livro
   ------------------------- */
function showBookDetails() {
    const b = mockBooks[selectedBookIndex];
    const copies = b.copies;
    modalContent.innerHTML = `
    <h3 style="font-weight:700;margin-bottom:8px">${b.title}</h3>
    <div><strong>Autor:</strong> ${b.author}</div>
    <div style="margin-top:8px"><strong>Edição:</strong> ${b.edition}</div>
    <div style="margin-top:8px"><strong>Endereço:</strong><br>${b.address}</div>
    <div style="margin-top:8px"><strong>Status:</strong><ul><li>Disponível: ${copies.disponivel}</li><li>Emprestado: ${copies.emprestado}</li><li>Reservado: ${copies.reservado}</li></ul></div>
    <button id="close-modal" style="margin-top:12px;padding:8px 10px;background:#4f46e5;color:#fff;border-radius:6px;border:0;width:100%">Fechar</button>
  `;
    modalOverlay.classList.remove('hidden'); modalOverlay.style.display = 'flex';
    document.getElementById('close-modal').addEventListener('click', closeModal);
}
function closeModal() { modalOverlay.classList.add('hidden'); modalOverlay.style.display = 'none'; }

/* -------------------------
   Map render + route animation
   ------------------------- */
function drawLibraryMapAndRoute(book) {
    const mapContainer = document.getElementById('map-container');
    const svg = document.getElementById('route-svg');
    const tracker = document.getElementById('route-tracker');
    const tooltip = document.getElementById('cell-tooltip');

    mapContainer.innerHTML = ''; svg.innerHTML = ''; tracker.style.display = 'none'; tooltip.style.display = 'none';

    // build grid
    const gridSize = 17;
    let shelfCounter = 1;
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = `cell-${r}-${c}`;
            cell.dataset.r = r; cell.dataset.c = c;

            if ((r % 2 !== 0) && (c % 2 !== 0)) {
                cell.classList.add('shelf-block');
                cell.innerHTML = `<div style="text-align:center;font-size:0.78rem;font-weight:700">E${shelfCounter}</div>`;
                cell.title = `Estante ${shelfCounter}`;
                shelfCounter++;
            } else if ((r % 2 === 0) && (c % 2 !== 0)) {
                cell.classList.add('road');
                const idx = Math.floor(r / 2);
                cell.innerHTML = `<div style="font-size:0.6rem">${mapData.ruas[idx] || ''}</div>`;
            } else if ((r % 2 !== 0) && (c % 2 === 0)) {
                cell.classList.add('avenue');
                const idx = Math.floor(c / 2);
                cell.innerHTML = `<div style="font-size:0.6rem;writing-mode:vertical-rl;transform:rotate(180deg)">${mapData.avenidas[idx] || ''}</div>`;
            } else {
                cell.classList.add('crossing');
                cell.innerHTML = `<div style="font-size:0.6rem">+</div>`;
            }

            // tooltip behaviour
            cell.addEventListener('mouseenter', (ev) => {
                const r0 = Number(cell.dataset.r), c0 = Number(cell.dataset.c);
                const shelfNum = getShelfNumberFromCoords({ row: r0, col: c0 });
                const label = shelfNum ? `Estante E${shelfNum}` : `${mapData.ruas[Math.floor(r0 / 2)] || ''} / ${mapData.avenidas[Math.floor(c0 / 2)] || ''}`;
                tooltip.innerText = label;
                tooltip.style.display = 'block';
                positionTooltip(ev.pageX, ev.pageY);
            });
            cell.addEventListener('mousemove', (ev) => positionTooltip(ev.pageX, ev.pageY));
            cell.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

            mapContainer.appendChild(cell);
        }
    }

    // compute start/end and mark icons
    const start = currentStartPoint;
    const end = calculateShelfCoordinates(book.shelfNumber);
    lastBookLocation = { ...end };

    const startCell = document.getElementById(`cell-${start.row}-${start.col}`);
    if (startCell) {
        const wrapper = document.createElement('div'); wrapper.className = 'user-marker'; wrapper.innerHTML = userSvg;
        wrapper.style.position = 'absolute'; wrapper.style.transform = 'translate(-50%,-50%)'; wrapper.style.left = '50%'; wrapper.style.top = '50%';
        startCell.appendChild(wrapper);
    }
    const endCell = document.getElementById(`cell-${end.row}-${end.col}`);
    if (endCell) {
        const wrapper = document.createElement('div'); wrapper.className = 'dest-marker'; wrapper.innerHTML = bookSvg;
        wrapper.style.position = 'absolute'; wrapper.style.transform = 'translate(-50%,-50%)'; wrapper.style.left = '50%'; wrapper.style.top = '50%';
        endCell.appendChild(wrapper);
    }

    // compute path via A*
    const startNode = { r: start.row, c: start.col };
    const endNode = { r: end.row, c: end.col };
    const path = aStar(startNode, endNode);
    const finalPath = path ? path : fallbackLPath(startNode, endNode);

    // draw SVG polyline and animate
    animatePath(finalPath);
}

/* fallback L-shape */
function fallbackLPath(start, end) {
    const arr = [];
    const stepC = end.c >= start.c ? 1 : -1;
    for (let cc = start.c; cc !== end.c + stepC; cc += stepC) arr.push({ r: start.r, c: cc });
    const stepR = end.r >= start.r ? 1 : -1;
    for (let rr = start.r + stepR; rr !== end.r + stepR; rr += stepR) arr.push({ r: rr, c: end.c });
    return arr;
}

/* compute map pixel positions and draw polyline + tracker */
function animatePath(pathArray) {
    if (!pathArray || pathArray.length === 0) return;
    const map = document.getElementById('map-container');
    const mapRect = map.getBoundingClientRect();
    if (mapRect.width === 0 || mapRect.height === 0) {
        // try later if layout not ready
        setTimeout(() => animatePath(pathArray), 30);
        return;
    }
    const svg = document.getElementById('route-svg');
    svg.innerHTML = '';
    svg.setAttribute('width', mapRect.width);
    svg.setAttribute('height', mapRect.height);
    svg.setAttribute('viewBox', `0 0 ${mapRect.width} ${mapRect.height}`);

    const cellW = mapRect.width / 17;
    const cellH = mapRect.height / 17;
    const points = pathArray.map(p => [(p.c + 0.5) * cellW, (p.r + 0.5) * cellH]);

    // background stroke
    const ns = "http://www.w3.org/2000/svg";
    const polyBg = document.createElementNS(ns, 'polyline');
    polyBg.setAttribute('points', points.map(pt => pt.join(',')).join(' '));
    polyBg.setAttribute('class', 'route-line-bg');
    svg.appendChild(polyBg);

    const poly = document.createElementNS(ns, 'polyline');
    poly.setAttribute('points', points.map(pt => pt.join(',')).join(' '));
    poly.setAttribute('class', 'route-line');
    svg.appendChild(poly);

    // tracker setup
    const tracker = document.getElementById('route-tracker');
    tracker.style.display = 'block';
    tracker.style.left = points[0][0] + 'px';
    tracker.style.top = points[0][1] + 'px';
    tracker.innerHTML = `<div style="width:32px;height:32px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(2,6,23,0.18);">${userSvg}</div>`;

    // animate tracker along polyline smoothly
    const segLens = [];
    let totalLen = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1][0] - points[i][0], dy = points[i + 1][1] - points[i][1];
        const L = Math.hypot(dx, dy);
        segLens.push(L); totalLen += L;
    }
    const speedPerPixel = 2.8; // px per ms (tweak speed)
    const totalDuration = Math.max(800, Math.floor(totalLen / speedPerPixel));

    // schedule cell pulses
    scheduleCellPulses(pathArray, 140);

    const startTime = performance.now();
    function frame(now) {
        const t = Math.min(1, (now - startTime) / totalDuration);
        const dist = t * totalLen;
        let acc = 0, si = 0;
        while (si < segLens.length && acc + segLens[si] < dist) { acc += segLens[si]; si++; }
        if (si >= segLens.length) {
            tracker.style.left = points[points.length - 1][0] + 'px';
            tracker.style.top = points[points.length - 1][1] + 'px';
        } else {
            const remain = dist - acc; const ratio = segLens[si] === 0 ? 0 : remain / segLens[si];
            const x = points[si][0] + (points[si + 1][0] - points[si][0]) * ratio;
            const y = points[si][1] + (points[si + 1][1] - points[si][1]) * ratio;
            tracker.style.left = x + 'px'; tracker.style.top = y + 'px';
        }
        if (t < 1) requestAnimationFrame(frame);
        else {
            // keep tracker at end; no hide
        }
    }
    requestAnimationFrame(frame);
}

/* aplica efeito pulsante sequencial nas células do caminho */
function scheduleCellPulses(pathArray, delayMs = 140) {
    // limpa classes antigas
    document.querySelectorAll('#map-container .grid-cell.path').forEach(n => n.classList.remove('path'));
    document.querySelectorAll('#map-container .grid-cell.path-step').forEach(n => n.classList.remove('path-step'));

    pathArray.forEach((coord, idx) => {
        const id = `cell-${coord.r}-${coord.c}`;
        setTimeout(() => {
            const cell = document.getElementById(id);
            if (!cell) return;
            cell.classList.add('path');
            cell.classList.add('path-step');
            setTimeout(() => { cell.classList.remove('path-step'); }, 700);
        }, idx * delayMs);
    });
}

/* posiciona tooltip de célula */
function positionTooltip(pageX, pageY) {
    const tooltip = document.getElementById('cell-tooltip');
    if (!tooltip) return;
    tooltip.style.left = (pageX - document.body.getBoundingClientRect().left) + 'px';
    tooltip.style.top = (pageY - document.body.getBoundingClientRect().top - 12) + 'px';
}

/* -------------------------
   Navegação & handlers
   ------------------------- */
function handleLogin() {
    const m = document.getElementById('matricula').value;
    const s = document.getElementById('senha').value;
    const err = document.getElementById('login-error');
    err.classList.add('hidden');
    if (m === validMatricula && s === validSenha) {
        currentScreen = 'search'; currentStartPoint = { row: 0, col: 0 }; renderApp();
    } else {
        err.innerText = 'Matrícula ou senha inválida.'; err.classList.remove('hidden');
    }
}

function showFinalPopup() {
    modalContent.innerHTML = `
    <h3 style="font-weight:700">Fim do Trajeto</h3>
    <p>Deseja pesquisar outro livro?</p>
    <div style="margin-top:10px;display:flex;gap:8px">
      <button id="search-again" style="flex:1;background:#059669;color:#fff;padding:8px;border-radius:6px;border:0">Pesquisar Outro</button>
      <button id="exit" style="flex:1;background:#dc2626;color:#fff;padding:8px;border-radius:6px;border:0">Sair</button>
    </div>
  `;
    modalOverlay.classList.remove('hidden'); modalOverlay.style.display = 'flex';
    document.getElementById('search-again').addEventListener('click', () => {
        closeModal();
        currentStartPoint = { ...lastBookLocation };
        currentScreen = 'search'; renderApp();
    });
    document.getElementById('exit').addEventListener('click', () => {
        closeModal();
        currentStartPoint = { row: 0, col: 0 };
        currentScreen = 'login'; renderApp();
    });
}

/* -------------------------
   Router
   ------------------------- */
function renderApp() {
    if (currentScreen === 'login') renderLoginScreen();
    if (currentScreen === 'search') renderSearchScreen();
    if (currentScreen === 'route') renderRouteScreen();
}

/* -------------------------
   Inicialização
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
});
