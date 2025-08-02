//событие нажал на кнопку задачи
document.getElementById('tasksBtn').addEventListener('click', newTask)

//пишем текст задачки
function newTask() {
        const index = Math.floor(Math.random() * tasks.length);
        document.getElementById('currentTask').dataset.index = index;
        const currentTask = tasks[index]
        document.getElementById('currentTask').textContent=currentTask.question;
        document.getElementById('currentClue').textContent='';
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
    document.getElementById('modalTitle').innerHTML = 'Результат проверки'
    feedbackText.innerHTML = "Проверка ответа...";
    feedbackModal.style.display = 'flex';
    askOpenAI().then(result => {
        feedbackText.innerHTML = result.replace(/\n/g, '<br>');
    });
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
    
   try {
                const result = await checkAnswer(tasks, index, studentAnswer, toStats);
                resultElement.textContent = result;
            } catch (error) {
                resultElement.textContent = `Ошибка: ${error.message}`;
            }
}

function checkOperationStatus(operationId) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Превышено время ожидания статуса операции'));
        }, TIMEOUT_MS);

        fetch(`https://llm.api.cloud.yandex.net/foundationModels/v1/operations/${operationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Api-Key ${API_KEY}`,
                'x-folder-id': FOLDER_ID,
            },
        })
            .then((response) => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
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
                { role: "system", content: `Привет. Мне задали задачу по анатомии, в решебнике даны ответы, но я их не подсматриваю. Проверяй ответ только после "Мой ответ:" Если после "Мой ответ:" нет ничего - значит я не ответил. Срвни мой ответ с ответом из решебника. Дай мне оценку (совсем неверно/неверно/не совсем верно/верно - укрась эмодзи). Если ответ не содержит ошибок, но немного неполный - это нормальный ответ. Напиши в самом конце сообщения "false" (если мой ответ неверный) или "true" (если мой ответ скорее верный) и дай свой комментарий - совет, как можно улучшить свой ответ. Минимум 10 предложений. Обращайся ко мне на ты. Используй '\\n' для переноса строки.\n Задача: \"${questionText}\"\nОтвет из решебника: \"${referenceAnswer}\"`},
                { role: "user", content: `${replaceSpecialChars(studentAnswer)}` }
            ]
    return message
}    

function toStats(i) {
    console.log(i)
}

document.addEventListener('DOMContentLoaded', newTask());




document.getElementById('showReference').addEventListener('click', showReference)

function showReference() {
    if (window.Telegram && Telegram.WebApp)    

    // Отключаем кнопку
    checkBtn.disabled = true;

    //Показываем модалку сразу
    feedbackText.innerHTML = "...";
    document.getElementById('modalTitle').innerHTML = 'Верный ответ'
    feedbackModal.style.display = 'flex';
    const index = document.getElementById('currentTask').dataset.index;
    feedbackText.innerHTML = `Задача:\n${tasks[index].question}\n\nОтвет:\n${tasks[index].reference}`.replace(/\n/g, '<br>');
}

document.getElementById('showClue').addEventListener('click', () => {
     document.getElementById('currentClue').textContent = `\nПодсказка: ${tasks[document.getElementById('currentTask').dataset.index].clue}`;
});