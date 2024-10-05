let games = []; // Lista de juegos
let favorites = []; // Lista de juegos favoritos
let reviews = []; // Lista de reseñas

// Cargar juegos iniciales
function loadGames() {
    games = [
        { id: 1, name: "Aventura Épica", category: "action", rating: 4.5, image: "aventuraepica.webp" },
        { id: 2, name: "Desafío de Estrategia", category: "strategy", rating: 4.0, image: "juegoestraregia.jpg" },
        { id: 3, name: "Carrera Acelerada", category: "sports", rating: 4.2, image: "carrera.jpg" },
        // Agrega más juegos aquí...
    ];

    const gamesList = document.getElementById('games-list');
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <div class="rating">
                <span>Rating: ${game.rating}</span>
                <button onclick="addToFavorites(${game.id})">Agregar a Favoritos</button>
            </div>
        `;
        gamesList.appendChild(gameCard);
    });
}

function addToFavorites(gameId) {
    const game = games.find(g => g.id === gameId);
    if (game && !favorites.includes(game)) {
        favorites.push(game);
        updateFavoriteCount();
        alert(`${game.name} agregado a favoritos.`);
    }
}

function updateFavoriteCount() {
    document.getElementById('favorite-count').innerText = `(${favorites.length})`;
    loadFavorites();
}

function loadFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    favorites.forEach(game => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'game-card';
        favoriteItem.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
        `;
        favoritesList.appendChild(favoriteItem);
    });
}

function filterGames() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    const filteredGames = games.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchValue);
        const matchesCategory = categoryFilter ? game.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '';
    filteredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <div class="rating">
                <span>Rating: ${game.rating}</span>
                <button onclick="addToFavorites(${game.id})">Agregar a Favoritos</button>
            </div>
        `;
        gamesList.appendChild(gameCard);
    });
}

function registerGame(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const game = document.getElementById('game').value;
    const link = document.getElementById('link').value;

    alert(`Juego registrado: ${game} por ${name}`);
    // Lógica para almacenar el juego registrado

    document.getElementById('register-form').reset();
}

function submitReview() {
    const userName = prompt("Tu nombre:");
    const text = prompt("Tu reseña:");
    if (userName && text) {
        const review = { userName, text };
        reviews.push(review);
        loadReviews();
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `<p><strong>${review.userName}:</strong> ${review.text}</p>`;
        reviewsList.appendChild(reviewItem);
    });
}

// Inicializar juegos al cargar la página
window.onload = loadGames;

let canvas, ctx;
let car, obstacles = [];
let score = 0;
let isGameOver = false;
let gameSpeed = 2;

function startGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    car = { x: canvas.width / 2 - 25, y: canvas.height - 100, width: 50, height: 100 };
    obstacles = [];
    score = 0;
    isGameOver = false;
    document.getElementById('gameStatus').innerText = '';
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (Math.random() < 0.02) {
        const obstacle = { x: Math.random() * (canvas.width - 50), y: -50, width: 50, height: 100 };
        obstacles.push(obstacle);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += gameSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
        } else if (isColliding(car, obstacles[i])) {
            isGameOver = true;
            document.getElementById('gameStatus').innerText = '¡Juego Terminado! Puntuación: ' + score;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar();
    drawObstacles();
    drawScore();
}

function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Puntuación: ' + score, 10, 20);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && car.x > 0) {
        car.x -= 15;
    } else if (e.key === 'ArrowRight' && car.x + car.width < canvas.width) {
        car.x += 15;
    }
});
