// yandexGptApi.js
const API_KEY = atob('QVFWTnp0Vm4ya2k4a1hrSFUtdC1uRXJleWVlN290d0NfaHl2R005LQ=='); // Заменить на безопасный способ хранения
const FOLDER_ID = 'b1gruhrtqobcuojmk0ee';
const API_URL = 'https://d5dufaskevsssmp4temj.laqt4bj7.apigw.yandexcloud.net';//'https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync';
const TIMEOUT_MS = 2000;


document.getElementById('checkAnswer').addEventListener('click', AI)

async function postYandexGPT() {
    let timeoutId
    try
    {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Превышено время ожидания')), TIMEOUT_MS);
    });

    const apiPromise = fetch(API_URL, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Api-Key ${API_KEY}`,
            'x-folder-id': FOLDER_ID,
        },
        body: JSON.stringify({
        "modelUri": `gpt://${FOLDER_ID}/yandexgpt-lite`,
        "completionOptions": {
            "stream": false,
            "temperature": 0.6,
            "maxTokens": "2000"
        },
        "messages":[
          {
            "role" : "user",
            "text" : "Hello, how are you ?"
          }
          ]
    }),
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
    return getAnswer(response.json().id);
    }

    catch (error) {
        return `Не удалось получить ответ! Попробуйте позже\nОшибка: ${error.message}`;
    }
}
    
async function getAnswer(id) {
    try
    {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Превышено время ожидания')), TIMEOUT_MS);
    });

    const apiPromise = fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${API_KEY}`,
                'x-folder-id': FOLDER_ID,

            }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
    return getAnswer(response.json());
    }

    catch (error) {
        return `Не удалось получить ответ! Попробуйте позже\nОшибка: ${error.message}`;
    }
}
/*
// Отправка запроса к YandexGPT API
async function sendYandexGPTRequest(messages) {
    const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Превышено время ожидания ответа от сервера'));
        }, TIMEOUT_MS);
    });

    const requestBody = {
        modelUri: `gpt://${FOLDER_ID}/yandexgpt`,
        completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 2000,
        },
        messages,
    };

    const apiPromise = fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Api-Key ${API_KEY}`,
            'x-folder-id': FOLDER_ID,
        },
        body: JSON.stringify(requestBody),
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
    return response.json();
}

// Проверка статуса операции
async function checkOperationStatus(operationId) {
    const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Превышено время ожидания статуса операции'));
        }, TIMEOUT_MS);
    });

    const apiPromise = fetch(`https://llm.api.cloud.yandex.net/foundationModels/v1/operations/${operationId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Api-Key ${API_KEY}`,
            'x-folder-id': FOLDER_ID,
        },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
}

// Экранирование специальных символов
function replaceSpecialChars(text) {
    const replacements = {
        '\t': '\\t',
        '\n': '\\n',
        '\r': '\\r',
        '\f': '\\f',
        '"': '\\"',
        '\\': '\\\\',
    };
    return text.replace(/[\t\n\r\f"\\]/g, (char) => replacements[char]);
}

// Формирование сообщений для API
function messageForAI(tasks, index, studentAnswer) {
    const currentTask = tasks[index];
    if (!currentTask) throw new Error('Задача не найдена');
    const { question: questionText, reference: referenceAnswer } = currentTask;

    return [
        {
            role: 'system',
            content: `Привет. Мне задали задачу по анатомии, в решебнике даны ответы, но я их не подсматриваю. Проверяй ответ только после "Мой ответ:" Если после "Мой ответ:" нет ничего - значит я не ответил. Сравни мой ответ с ответом из решебника. Дай мне оценку (совсем неверно/неверно/не совсем верно/верно - укрась эмодзи). Если ответ не содержит ошибок, но немного неполный - это нормальный ответ. Напиши в самом конце сообщения "false" (если мой ответ неверный) или "true" (если мой ответ скорее верный) и дай свой комментарий - совет, как можно улучшить свой ответ. Минимум 10 предложений. Обращайся ко мне на ты. Используй '\\n' для переноса строки.\n Задача: "${questionText}"\nОтвет из решебника: "${referenceAnswer}"`,
        },
        { role: 'user', content: replaceSpecialChars(studentAnswer || '') },
    ];
}

// Основная функция для проверки ответа
async function checkAnswer(tasks, index, studentAnswer, toStats) {
    try {
        const messages = messageForAI(tasks, index, studentAnswer);
        const operation = await sendYandexGPTRequest(messages);

        let result;
        do {
            result = await checkOperationStatus(operation.id);
            if (!result.done) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } while (!result.done);

        if (!result.response?.alternatives?.[0]?.message?.text) {
            throw new Error('Ответ от API не содержит текста');
        }

        let answer = result.response.alternatives[0].message.text;
        answer = answer.replace(/T/g, 't').replace(/F/g, 'f');
        if (answer.includes('true')) {
            toStats(true);
            answer = answer.split('true').join('');
        } else {
            toStats(false);
            answer = answer.split('false').join('');
        }

        return answer || 'Не получилось получить ответ';
    } catch (error) {
        return `Не удалось получить ответ! Попробуйте позже\nОшибка: ${error.message}`;
    }
}

// Экспорт для использования в браузере
export { checkAnswer }*/