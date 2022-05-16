let messages = [];

const elements = {
    listMessages: document.getElementById('list-messages'),
    inputAuthor: document.getElementById('input-author'),
    inputText: document.getElementById('input-text'),
    buttonSend: document.getElementById('button-send'),
};

async function sendMessage() {
    const message = {
        author: elements.inputAuthor.value,
        text: elements.inputText.value,
    };
    await fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message),
    }).catch(handleError);
    elements.inputText.value = '';
    setTimeout(() => elements.inputText.focus());
    loadMessages();
}


function handleError(error) {
    alert('An error occured: ' + error?.message)
}

async function loadMessages() {
    const response = await fetch('/api/messages').catch(handleError);
    messages = await response.json();
    renderMessages()
}

async function renderMessages() {
    const ul = elements.listMessages; // Введем псевдоним для элемента, чтобы запись обращения к нему в функции была короче
    // Запомним, если скролл находился внизу. Поскольку математичка размеров элементов неточна, воспользуемся неравенством.
    const shouldScroll = Math.abs(ul.scrollHeight - ul.scrollTop - ul.clientHeight) < 1;
    // Полностью очистим список
    elements.listMessages.innerHTML = '';
    // Для каждого сообщения в цикле:
    for (const message of messages) {
        // создадим элемент для добавления в DOM,
        const li = document.createElement('li');
        // распарсим строку с датой, которую получили с бэкенда,
        const timestamp = new Date(message.timestamp);
        // сформируем текстовую запись с датой, автором и контентом сообщения,
        li.innerHTML = `<span class="message-meta">[${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}] ${message.author}:</span> ${message.text}`;
        // добавим новый элемент (сообщение) в список.
        elements.listMessages.appendChild(li);
    }
    // Если скроллбар находился в самом низу, опустим его ещё пониже, чтобы показать новое сообщение.
    if (shouldScroll) {
        ul.scrollTop = ul.scrollHeight;
    }
}

elements.buttonSend.addEventListener('click', sendMessage);
elements.inputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
setInterval(loadMessages, 2000);
loadMessages();
elements.listMessages.scrollTop = elements.listMessages.scrollHeight;


elements.inputAuthor.value = localStorage.getItem('author')
elements.inputAuthor.addEventListener('input', () => {
    localStorage.setItem('author', elements.inputAuthor.value);
});
if (!elements.inputAuthor.value) {
    elements.inputAuthor.focus();
}