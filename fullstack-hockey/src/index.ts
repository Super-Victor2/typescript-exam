window.addEventListener('load', () : void => {
    navSetup();
    sectionSetup();
    logPlayers();
});

interface playersApiResponse {
    data: playerCard[];
    meta: {

    };
}

interface playerCard {
    id: number,
    first_name: string,
    last_name: string,
    position: string,
    height: string,
    weight: string,
    jersey_number: number,
    country: string,
    team: team
}

interface team {
    full_name: string, 
    city: string
}

async function logPlayers() {
    const players : playerCard[] = await fetchPlayers();
    appendPlayerCards(players);
}

async function fetchPlayers() : Promise<playerCard[]> {
    try {
        const response = await fetch("https://api.balldontlie.io/v1/players", {
            headers: {
                "Authorization": "d431ba5f-acb4-4e6f-b9f8-ba1e9dbbadff"
            }
        });
        if (!response.ok) {
            throw new Error('Fel med att hämta api');
        } else {
            const result: playersApiResponse = await response.json();
            console.log(result);
            return result.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function fetchSpecificPlayer() : Promise<playerCard[]> {
    try {
        const response = await fetch("https://api.balldontlie.io/v1/players/<ID>", {
            headers: {
                "Authorization": "d431ba5f-acb4-4e6f-b9f8-ba1e9dbbadff"
            }
        });
        if (!response.ok) {
            throw new Error('Fel med att hämta api');
        } else {
            const result: playersApiResponse = await response.json();
            console.log(result);
            return result.data;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

let selectedPlayers: playerCard[] = [];

const searchInput = document.querySelector('#search') as HTMLInputElement;

searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        await searchForSpecificPlayer();
    }
});

async function searchForSpecificPlayer() {
    const searchInput = document.querySelector('#search') as HTMLInputElement;
    const teamBuildSection = document.querySelector('.team-build-cards') as HTMLElement;
    
    const players: playerCard[] = await fetchPlayers();

    const searchTerms = searchInput.value.toLowerCase().split(' ');
    const player = players.find(p =>
        searchTerms.every(term =>
            p.first_name.toLowerCase().includes(term) ||
            p.last_name.toLowerCase().includes(term)
        )
    );

    if (!player) {
        alert('Player was not found');
        return;
    }

    const canAddPlayer = canAddPlayerByPosition(player.position);

    if (selectedPlayers.length >= 5 && !canAddPlayer) {
        alert('Max players and position occupied')
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
}

function canAddPlayerByPosition(position: string): boolean {
    const positionOccupied = selectedPlayers.some(player => player.position === position);
    return !positionOccupied;
}

function appendPlayerCards(players: playerCard[]): void {
    const playerContainer = document.querySelector('.player-section-wrapper') as HTMLElement;

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
        })

        playerContainer.appendChild(card);
    });
}

function addToLocalStorage(player: playerCard): void {
    const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[]');
    
    storedPlayers.push(player);
    
    localStorage.setItem('selectedPlayers', JSON.stringify(storedPlayers));
    console.log('Player added to localStorage:', player);
}

function loadFromLocalStorage(): void {
    const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[]');
    const favoritesContainer = document.querySelector('#favorites-section .favorites-section-wrapper') as HTMLElement;
    
    favoritesContainer.innerHTML = '';

    storedPlayers.forEach((player: playerCard) => {
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

function navSetup() : void {
    const navItemRefs = document.querySelectorAll('.nav-item') as NodeListOf<HTMLElement>
    navItemRefs.forEach(navItem => {
        navItem.addEventListener('click', (event : MouseEvent) : void => {
            toggleSectionDisplay((event.target as HTMLElement).dataset.id);
        });
    });
}

function toggleSectionDisplay(section: string | undefined): void {
    const playerSection = document.querySelector('#player-section');
    const favoritesSection = document.querySelector('#favorites-section');
    const teamBuildSection = document.querySelector('#team-build')

    if (section === "player") {
        playerSection?.classList.remove('d-none');
        favoritesSection?.classList.add('d-none');
        teamBuildSection?.classList.add('d-none');
    } else if (section === "favorites") {
        playerSection?.classList.add('d-none');
        teamBuildSection?.classList.add('d-none');
        favoritesSection?.classList.remove('d-none');
        loadFromLocalStorage()
    } else if (section === "home") {
        playerSection?.classList.add('d-none');
        favoritesSection?.classList.add('d-none');
        teamBuildSection?.classList.remove('d-none');
    }
}

function sectionSetup() : void {
    const sectionRefs = document.querySelectorAll('.section') as NodeListOf<HTMLElement>;
    sectionRefs.forEach(section => section.classList.add('d-none'));
}
