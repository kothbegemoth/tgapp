document.addEventListener('DOMContentLoaded', function() {

    const container = document.getElementById('titliesContainer');

    // модалка закрытта
    feedbackModal.style.display = 'none';
    
    // Функция создания кнопок
    function renderButtons(titlies) {
        container.innerHTML = ''; // Очищаем контейнер
        
        titlies.forEach((title, index) => {
            const btn = document.createElement('button');
            btn.className = 'title-btn';
            btn.textContent = title;
            btn.dataset.id = 'ticketTitle'+index;
            btn.dataset.index = index;

            btn.addEventListener('click', () => showTheory(index))
            
            container.appendChild(btn);
        });
    }
    
    // Отрисорвка кнопок
    renderButtons(tickets.map(ticket => ticket.title));
});

//открывть билет
function showTheory(index){
    const container = document.getElementById('imageBlock');
    container.innerHTML = '';
    const ticket = tickets[index];
    ticket.img.forEach((item) => {
        const img = document.createElement('img');
        img.className = 'ticket-img';
        img.src = item;

        container.appendChild(img);       
    });

    
    feedbackModal.style.display = 'flex';
};

//закрыть
document.querySelector('.close').addEventListener('click', () => {
    feedbackModal.style.display = 'none';
});
// Кнопка "Всё пон"
document.getElementById('closeTicket').addEventListener('click', () => {
    feedbackModal.style.display = 'none';
    //если мы в тг
    //if (window.Telegram && Telegram.WebApp) {
        // обновляем sql
    //    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    //}
});