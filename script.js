const input = document.getElementById('tarefaInput');
const btnAdd = document.getElementById('btnAdd');
const lista = document.getElementById('listaTarefas');

let id = 1;

window.addEventListener('load', () => {
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    id = tarefasSalvas.length > 0 ? Math.max(...tarefasSalvas.map(t => t.id)) + 1 : 1;
    tarefasSalvas.forEach(tarefa => {
        criarElementoTarefa(tarefa);
    });
});

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.textContent = tarefa.texto;

    // guarda o id como atributo data-id (invisível visualmente para o usuário)
    li.dataset.id = tarefa.id;

    if (tarefa.concluida) {
        li.classList.add('concluido');
    }

    const btnFeito = document.createElement('button');
    btnFeito.className = 'feito';
    btnFeito.textContent = '✔️';
    btnFeito.addEventListener('click', () => {
        li.classList.toggle('concluido');
        tarefa.concluida = li.classList.contains('concluido');
        salvarTarefas();
    });

    const btnRemover = document.createElement('button');
    btnRemover.className = 'remove';
    btnRemover.textContent = '✖️';
    btnRemover.addEventListener('click', () => {
        lista.removeChild(li);
        removerTarefa(tarefa.id);
    });

    const containerBotoes = document.createElement('div');
    containerBotoes.className = 'botoes';
    containerBotoes.appendChild(btnFeito);
    containerBotoes.appendChild(btnRemover);

    li.appendChild(containerBotoes);
    lista.appendChild(li);
}

btnAdd.addEventListener('click', () => {
    const texto = input.value.trim();

    if (texto === '') {
        alert('Por favor, digite uma tarefa.');
        return;
    }

    const novaTarefa = {
        id: id++,
        texto: texto,
        concluida: false
    };

    criarElementoTarefa(novaTarefa);
    salvarNovaTarefa(novaTarefa);

    input.value = '';
    input.focus();
});

// salvando a nova tarefa em um banco local (localstorage)
function salvarNovaTarefa(tarefa) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function salvarTarefas() {
    const itens = lista.querySelectorAll('li');
    const tarefasAtualizadas = [];

    itens.forEach(li => {
        const textoLi = li.childNodes[0].nodeValue.trim();
        const idTarefa = Number(li.dataset.id);
        const concluida = li.classList.contains('concluido');

        tarefasAtualizadas.push({
            id: idTarefa,
            texto: textoLi,
            concluida: concluida
        });
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
}

// remove a tarefa do localstorage
function removerTarefa(id) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas = tarefas.filter(t => t.id !== id);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
