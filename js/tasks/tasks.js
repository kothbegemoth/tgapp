//событие нажал на кнопку задачи
document.getElementById('tasksBtn').addEventListener('click', newTask)

//пишем текст задачки
function newTask() {
        const index = Math.floor(Math.random() * tasks.length);
        document.getElementById('currentTask').dataset.index = index;
        const currentTask = tasks[index]
        document.getElementById('currentTask').textContent=currentTask.question;
}


//событие нажал на кнопку проверить
document.getElementById('checkAnswer').addEventListener('click', showFeedback)

const feedbackModal = document.getElementById('feedbackModal');
const feedbackText = document.getElementById('feedbackText');
const checkBtn = document.getElementById('checkAnswer');

// Показываем модалку с проверкой
function showFeedback() {
    if (window.Telegram && Telegram.WebApp)    

    // Отключаем кнопку
    checkBtn.disabled = true;

    //Показываем модалку сразу
    feedbackText.innerHTML = "Проверка ответа...";
    feedbackModal.style.display = 'flex';
    askOpenAI().then(result => {
        feedbackText.innerHTML = result.replace(/\n/g, '<br>');
    });
    //если мы в тг
    if (window.Telegram && Telegram.WebApp) {
        // обновляем sql
        const userId = Telegram.WebApp.initDataUnsafe.user.id;
    }
}

// Закрытие модалки
document.querySelector('.close').addEventListener('click', () => {
    feedbackModal.style.display = 'none';
// Включаем кнопку обратно
    checkBtn.disabled = false;
    document.getElementById('studentAnswer').value = "";
});

// Кнопка "Следующая задача"
document.getElementById('nextTaskBtn').addEventListener('click', () => {
    feedbackModal.style.display = 'none';
    checkBtn.disabled = false;
    document.getElementById('studentAnswer').value = ""
    newTask();
});


//нейронка 

async function askOpenAI() {
    // таймаут
    const TIMEOUT_MS = 25000;
    let timeoutId;

    try {
    //подключаемся к нейронке
        const apiKey = atob('c2stcHJvai1ybFZJVTB3T0hhdzFGTmx6ZWpUU0FidG1xVEw2ZkZIUDN1Qkx3SzI0ZjMxc21JSnNqcmd0Ulltc1p4R1ZSRVc0a0hqdGxFUzZBSVQzQmxia0ZKTVNGZllIUFRNUEVrMnJ5bW9xREtPQ1VmVGJzaG9oRk42Q1dzZmdhWXRiZlhqWXRmRENxTEFhOEdLMVdIZG9tZlUzNTNEeTgyd0E=')
        
        // Создаем промис для таймаута
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('Превышено время ожидания ответа от сервера'));
            }, TIMEOUT_MS);
        });

        // Создаем промис для запроса к API
        const apiPromise = fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messageForAI()
            })
        });

        // Используем Promise.race для соревнования между запросом и таймаутом
        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        // Если ответ получен, отменяем таймаут
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Ошибка сети');

        const data = await response.json();
        result = data.choices?.[0]?.message?.content;
        console.log(result);
        result.includes('true') 
            ? (() => {toStats(true); result = result.split('true').join('')})()
            : (() => { toStats(false); result = result.split('false').join(''); })();
        return result || "Не получилось получить ответ";
    }
    catch (error){
        return `Ошибка: ${error.message}`;
    }
}

    //замена символов
function replaceSpecialChars(text) {
    const replacements = {
        '\t': '\\t',
        '\n': '\\n',
        '\r': '\\r',
        '\f': '\\f',
        '"': '\\"',
        '\\': '\\\\'
    };

    return text.replace(/[\t\n\r\f"\\]/g, char => replacements[char]);
}

    //сообщение для нейронки
function messageForAI(){
    //берем текст задачки и реф ответа
    const index = document.getElementById('currentTask').dataset.index;
    const currentTask = tasks[index];
    const questionText = currentTask.question;
    const referenceAnswer = currentTask.reference;
    const studentAnswer = document.getElementById('studentAnswer').value;

    message = [
                { role: "system", content: `Привет. Мне задали задачу по анатомии, в решебнике даны ответы, но я их не подсматриваю. Проверяй ответ только после "Мой ответ:" Если после "Мой ответ:" нет ничего - значит я не ответил. Срвни мой ответ с ответом из решебника. Дай мне оценку (совсем неверно/неверно/не совсем верно/верно - укрась эмодзи). Если ответ не содержит ошибок, но немного неполный - это нормальный ответ. Напиши в самом конце сообщения "false" (если мой ответ неверный) или "true" (если мой ответ скорее верный) и дай свой комментарий - совет, как можно улучшить свой ответ. Минимум 10 предложений. Обращайся ко мне на ты. Используй '\\n' для переноса строки.\n Задача: ${questionText}\nОтвет из решебника: ${referenceAnswer}`},
                { role: "user", content: `Мой ответ: ${replaceSpecialChars(studentAnswer)}` }
            ]
    return message
}    

function toStats(i) {
    console.log(i)
}

document.addEventListener('DOMContentLoaded', newTask());



