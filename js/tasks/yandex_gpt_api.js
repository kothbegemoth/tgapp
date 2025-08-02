const fetch = require('node-fetch'); // Убери, если используешь встроенный fetch (Node.js 18+)

// Конфигурация (лучше вынести в переменные окружения)
const API_KEY = atob('QVFWTnp0Vm4ya2k4a1hrSFUtdC1uRXJleWVlN290d0NfaHl2R005LQ==');
const FOLDER_ID = 'b1gruhrtqobcuojmk0ee';
const API_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync';

// Отправка запроса к YandexGPT
function sendYandexGPTRequest(messages) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      modelUri: `gpt://${FOLDER_ID}/yandexgpt`,
      completionOptions: {
        stream: false,
        temperature: 0.6,
        maxTokens: 2000,
      },
      messages: messages,
    };

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${API_KEY}`,
        'x-folder-id': FOLDER_ID,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

// Проверка статуса операции
function checkOperationStatus(operationId) {
  return new Promise((resolve, reject) => {
    fetch(`https://llm.api.cloud.yandex.net/foundationModels/v1/operations/${operationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Api-Key ${API_KEY}`,
        'x-folder-id': FOLDER_ID,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

module.exports = { sendYandexGPTRequest, checkOperationStatus };