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
    postYandexGPT(messageForAI);
}


// Закрытие модалки
document.querySelector('.close').addEventListener('click', () => {
    feedbackModal.style.display = 'none';
// Включаем кнопку обратно
    checkBtn.disabled = false;
    //document.getElementById('studentAnswer').value = "";
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
