const tg = window.Telegram.WebApp;
tg.expand(); // Раскрыть на весь экран

document.getElementById('myButton').addEventListener('click', () => {
    tg.showAlert('Кнопка работает! 🎉');
});
