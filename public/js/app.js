const API_URL = '/api/veiculos';

const form = document.getElementById('form-veiculo');
const lista = document.getElementById('lista-veiculos');
const mensagem = document.getElementById('mensagem');
const contador = document.getElementById('contador');
const estadoVazio = document.getElementById('estado-vazio');
const formTitle = document.getElementById('form-title');
const btnCadastrar = document.getElementById('btn-cadastrar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnAtualizar = document.getElementById('btn-atualizar');
const apiStatus = document.getElementById('api-status');
const apiStatusText = document.getElementById('api-status-text');

let veiculos = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function mostrarMensagem(texto, tipo = 'success') {
  mensagem.textContent = texto;
  mensagem.className = `message ${tipo}`;

  window.clearTimeout(mostrarMensagem.timer);
  mostrarMensagem.timer = window.setTimeout(() => {
    mensagem.className = 'message hidden';
    mensagem.textContent = '';
  }, 4500);
}

async function obterRespostaJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detalhes = data.campos
      ? Object.values(data.campos).join(' ')
      : '';

    throw new Error(data.erro ? `${data.erro} ${detalhes}`.trim() : 'Ocorreu um erro.');
  }

  return data;
}

async function verificarApi() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error();

    apiStatus.className = 'status-dot online';
    apiStatusText.textContent = 'API online';
  } catch {
    apiStatus.className = 'status-dot offline';
    apiStatusText.textContent = 'API indisponível';
  }
}

function renderizarVeiculos() {
  lista.innerHTML = '';

  contador.textContent = veiculos.length === 1
    ? '1 veículo cadastrado'
    : `${veiculos.length} veículos cadastrados`;

  estadoVazio.classList.toggle('hidden', veiculos.length !== 0);

  if (veiculos.length === 0) {
    return;
  }

  for (const veiculo of veiculos) {
    const card = document.createElement('article');
    card.className = 'vehicle-card';
    card.dataset.id = veiculo._id;

    card.innerHTML = `
      <img
        class="vehicle-image"
        src="${escapeHtml(veiculo.imagemUrl)}"
        alt="Imagem do ${escapeHtml(veiculo.marca)} ${escapeHtml(veiculo.modelo)}"
        loading="lazy"
        onerror="this.src='https://placehold.co/800x450?text=Imagem+indispon%C3%ADvel'"
      >
      <div class="vehicle-body">
        <h4>${escapeHtml(veiculo.marca)} ${escapeHtml(veiculo.modelo)}</h4>
        <div class="vehicle-price">${formatarPreco(veiculo.preco)}</div>
        <div class="vehicle-info">${escapeHtml(veiculo.ano)} • ${escapeHtml(veiculo.cor)}</div>
        <p class="vehicle-description">${escapeHtml(veiculo.descricao || 'Sem descrição adicional.')}</p>
        <div class="card-actions">
          <button class="button-secondary btn-editar" type="button">Editar</button>
          <button class="button-danger btn-excluir" type="button">Excluir</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-editar').addEventListener('click', () => iniciarEdicao(veiculo));
    card.querySelector('.btn-excluir').addEventListener('click', () => excluirVeiculo(veiculo._id));

    lista.appendChild(card);
  }
}

async function carregarVeiculos() {
  contador.textContent = 'Carregando...';

  try {
    const response = await fetch(API_URL);
    veiculos = await obterRespostaJson(response);
    renderizarVeiculos();
  } catch (error) {
    lista.innerHTML = '';
    contador.textContent = 'Não foi possível carregar os veículos.';
    mostrarMensagem(error.message, 'error');
  }
}

function obterDadosFormulario() {
  return {
    marca: document.getElementById('marca').value.trim(),
    modelo: document.getElementById('modelo').value.trim(),
    ano: Number(document.getElementById('ano').value),
    preco: Number(document.getElementById('preco').value),
    cor: document.getElementById('cor').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    imagemUrl: document.getElementById('imagemUrl').value.trim()
  };
}

function preencherFormulario(veiculo) {
  document.getElementById('veiculo-id').value = veiculo._id;
  document.getElementById('marca').value = veiculo.marca;
  document.getElementById('modelo').value = veiculo.modelo;
  document.getElementById('ano').value = veiculo.ano;
  document.getElementById('preco').value = veiculo.preco;
  document.getElementById('cor').value = veiculo.cor;
  document.getElementById('descricao').value = veiculo.descricao || '';
  document.getElementById('imagemUrl').value = veiculo.imagemUrl;

  formTitle.textContent = 'Editar veículo';
  btnCadastrar.textContent = 'Salvar alterações';
  btnCancelar.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function iniciarEdicao(veiculo) {
  preencherFormulario(veiculo);
}

function cancelarEdicao() {
  form.reset();
  document.getElementById('veiculo-id').value = '';
  formTitle.textContent = 'Cadastrar veículo';
  btnCadastrar.textContent = 'Cadastrar veículo';
  btnCancelar.classList.add('hidden');
}

async function salvarVeiculo(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const id = document.getElementById('veiculo-id').value;
  const dados = obterDadosFormulario();
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  btnCadastrar.disabled = true;
  btnCadastrar.textContent = id ? 'Salvando...' : 'Cadastrando...';

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    await obterRespostaJson(response);

    mostrarMensagem(
      id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!',
      'success'
    );

    cancelarEdicao();
    await carregarVeiculos();
    await verificarApi();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  } finally {
    btnCadastrar.disabled = false;
    btnCadastrar.textContent = id ? 'Salvar alterações' : 'Cadastrar veículo';
  }
}

async function excluirVeiculo(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir este veículo?');

  if (!confirmar) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    await obterRespostaJson(response);

    mostrarMensagem('Veículo removido com sucesso!', 'success');
    await carregarVeiculos();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

form.addEventListener('submit', salvarVeiculo);
btnCancelar.addEventListener('click', cancelarEdicao);
btnAtualizar.addEventListener('click', carregarVeiculos);

document.addEventListener('DOMContentLoaded', async () => {
  await verificarApi();
  await carregarVeiculos();
});
