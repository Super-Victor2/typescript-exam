"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener('load', () => {
    navSetup();
    sectionSetup();
    logPlayers();
});
function logPlayers() {
    return __awaiter(this, void 0, void 0, function* () {
        const players = yield fetchPlayers();
        appendPlayerCards(players);
    });
}
function fetchPlayers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://api.balldontlie.io/v1/players", {
                headers: {
                    "Authorization": "d431ba5f-acb4-4e6f-b9f8-ba1e9dbbadff"
                }
            });
            if (!response.ok) {
                throw new Error('Fel med att hämta api');
            }
            else {
                const result = yield response.json();
                console.log(result);
                return result.data;
            }
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
function fetchSpecificPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://api.balldontlie.io/v1/players/<ID>", {
                headers: {
                    "Authorization": "d431ba5f-acb4-4e6f-b9f8-ba1e9dbbadff"
                }
            });
            if (!response.ok) {
                throw new Error('Fel med att hämta api');
            }
            else {
                const result = yield response.json();
                console.log(result);
                return result.data;
            }
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
let selectedPlayers = [];
const searchInput = document.querySelector('#search');
searchInput.addEventListener('keydown', (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.key === 'Enter') {
        yield searchForSpecificPlayer();
    }
}));
function searchForSpecificPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchInput = document.querySelector('#search');
        const teamBuildSection = document.querySelector('.team-build-cards');
        const players = yield fetchPlayers();
        const searchTerms = searchInput.value.toLowerCase().split(' ');
        const player = players.find(p => searchTerms.every(term => p.first_name.toLowerCase().includes(term) ||
            p.last_name.toLowerCase().includes(term)));
        if (!player) {
            alert('Player was not found');
            return;
        }
        const canAddPlayer = canAddPlayerByPosition(player.position);
        if (selectedPlayers.length >= 5 && !canAddPlayer) {
            alert('Max players and position occupied');
            return;
        }
        if (selectedPlayers.find(p => p.id === player.id)) {
            alert('Player is already added');
            return;
        }
        if (!canAddPlayer) {
            alert('Position is already occupied');
            return;
        }
        if (selectedPlayers.length >= 5) {
            alert('Max players already selected');
            return;
        }
        selectedPlayers.push(player);
        console.log("Player added:", player);
        const card = document.createElement('div');
        card.className = 'player-stats-card';
        card.innerHTML = `
        <h2 class="stats-title">${player.first_name} ${player.last_name}</h2>
        <p class="stats-text">Team: ${player.team ? player.team.full_name : 'No team info'}</p>
        <p class="stats-text">Pos: ${player.position}</p>
        <p class="stats-text">Height: ${player.height}</p>
        <p class="stats-text">Weight: ${player.weight}</p>
        <p class="stats-text">Number: ${player.jersey_number}</p>
        <p class="stats-text">Country: ${player.country}</p>
        <p class="stats-text">ID: ${player.id}</p>
    `;
        teamBuildSection.appendChild(card);
    });
}
function canAddPlayerByPosition(position) {
    const positionOccupied = selectedPlayers.some(player => player.position === position);
    return !positionOccupied;
}
function appendPlayerCards(players) {
    const playerContainer = document.querySelector('.player-section-wrapper');
    players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-stats-card';
        card.innerHTML = `
            <h2 class="stats-title">${player.first_name} ${player.last_name}</h2>
            <p class="stats-text">Team: ${player.team ? player.team.full_name : 'No team info'}</p>
            <p class="stats-text">Pos: ${player.position}</p>
            <p class="stats-text">Height: ${player.height}</p>
            <p class="stats-text">Weight: ${player.weight}</p>
            <p class="stats-text">Number: ${player.jersey_number}</p>
            <p class="stats-text">Country: ${player.country}</p>
            <p class="stats-text">ID: ${player.id}</p>
        `;
        card.addEventListener('click', () => {
            addToLocalStorage(player);
        });
        playerContainer.appendChild(card);
    });
}
function addToLocalStorage(player) {
    const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[]');
    storedPlayers.push(player);
    localStorage.setItem('selectedPlayers', JSON.stringify(storedPlayers));
    console.log('Player added to localStorage:', player);
}
function loadFromLocalStorage() {
    const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[]');
    const favoritesContainer = document.querySelector('#favorites-section .favorites-section-wrapper');
    favoritesContainer.innerHTML = '';
    storedPlayers.forEach((player) => {
        const card = document.createElement('div');
        card.className = 'player-stats-card';
        card.innerHTML = `
            <h2 class="stats-title">${player.first_name} ${player.last_name}</h2>
            <p class="stats-text">Team: ${player.team ? player.team.full_name : 'No team info'}</p>
            <p class="stats-text">Pos: ${player.position}</p>
            <p class="stats-text">Height: ${player.height}</p>
            <p class="stats-text">Weight: ${player.weight}</p>
            <p class="stats-text">Number: ${player.jersey_number}</p>
            <p class="stats-text">Country: ${player.country}</p>
            <p class="stats-text">ID: ${player.id}</p>
        `;
        favoritesContainer.appendChild(card);
    });
    console.log('Loaded players from localStorage:', storedPlayers);
}
function navSetup() {
    const navItemRefs = document.querySelectorAll('.nav-item');
    navItemRefs.forEach(navItem => {
        navItem.addEventListener('click', (event) => {
            toggleSectionDisplay(event.target.dataset.id);
        });
    });
}
function toggleSectionDisplay(section) {
    const playerSection = document.querySelector('#player-section');
    const favoritesSection = document.querySelector('#favorites-section');
    const teamBuildSection = document.querySelector('#team-build');
    if (section === "player") {
        playerSection === null || playerSection === void 0 ? void 0 : playerSection.classList.remove('d-none');
        favoritesSection === null || favoritesSection === void 0 ? void 0 : favoritesSection.classList.add('d-none');
        teamBuildSection === null || teamBuildSection === void 0 ? void 0 : teamBuildSection.classList.add('d-none');
    }
    else if (section === "favorites") {
        playerSection === null || playerSection === void 0 ? void 0 : playerSection.classList.add('d-none');
        teamBuildSection === null || teamBuildSection === void 0 ? void 0 : teamBuildSection.classList.add('d-none');
        favoritesSection === null || favoritesSection === void 0 ? void 0 : favoritesSection.classList.remove('d-none');
        loadFromLocalStorage();
    }
    else if (section === "home") {
        playerSection === null || playerSection === void 0 ? void 0 : playerSection.classList.add('d-none');
        favoritesSection === null || favoritesSection === void 0 ? void 0 : favoritesSection.classList.add('d-none');
        teamBuildSection === null || teamBuildSection === void 0 ? void 0 : teamBuildSection.classList.remove('d-none');
    }
}
function sectionSetup() {
    const sectionRefs = document.querySelectorAll('.section');
    sectionRefs.forEach(section => section.classList.add('d-none'));
}
