//пишем текст теста
function newTest() {
    //номер теста 
        const index = Math.floor(Math.random() * tests.length);       
    //заполнение
        document.getElementById('currentTest').dataset.index = index;
        const currentTest = tests[index];
        document.getElementById('currentTest').textContent=`${index}. ${currentTest.question}`;

    //кнопочки 
    shuffledIndex([0,1,2,3]).forEach((item, index) => {
        const element = document.getElementById(index + '_answer');
        element.textContent = currentTest.answers[item];
        element.dataset.index = item == 0 ? true : false;
        element.addEventListener('click', 
            () => showFeedback(item == 0 ? true : false));
    })
}

// Показываем модалку с проверкой
function showFeedback(trueResult) {
//Показываем модалку сразу
    const index = document.getElementById('currentTest').dataset.index;
    document.getElementById('testResult').innerHTML = trueResult ? 'Верно' : 'Неверно';
    document.getElementById('testCaption').innerHTML = `${index}. ${tests[index].caption}`;
    feedbackModal.style.display = 'flex';
    //если мы в тг
    if (window.Telegram && Telegram.WebApp) {
        // обновляем sql
        const userId = Telegram.WebApp.initDataUnsafe.user.id;
    }
}

// Закрытие модалки
document.querySelector('.close').addEventListener('click', () => {
    newTest();
    feedbackModal.style.display = 'none';
// Включаем кнопку обратно
    checkBtn.disabled = false;
    document.getElementById('studentAnswer').value = "";
});

// Кнопка "Следующая задача"
document.getElementById('nextTestBtn').addEventListener('click', () => {
    newTest();
    feedbackModal.style.display = 'none';
    checkBtn.disabled = false;
    document.getElementById('studentAnswer').value = ""
});

//перемешиваем список
function shuffledIndex(numbers) {
    const newNumbers = [];
    for (let i=0; i < 4; i++){
        const index = Math.floor(Math.random() * numbers.length);
        newNumbers.push(numbers[index]);
        numbers.splice(index, 1);
    }
    return newNumbers;
}

document.addEventListener('DOMContentLoaded', newTest);