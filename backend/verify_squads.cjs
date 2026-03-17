const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verify() {
  try {
    console.log('--- Squad Feature Backend Verification ---');

    // 1. Login as player
    console.log('Logging in as player...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testplayer@gmail.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Login successful.');

    // 2. Create a squad
    console.log('Creating squad "VANGUARD"...');
    const squadRes = await axios.post('http://localhost:5000/api/squads', {
      name: 'VANGUARD ' + Date.now(),
      logoUrl: ''
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const squadId = squadRes.data.id;
    console.log('Squad created:', squadRes.data.name);

    // 3. Get my squads
    console.log('Fetching my squads...');
    const mineRes = await axios.get('http://localhost:5000/api/squads/mine', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Fetched', mineRes.data.length, 'squads.');

    // 4. Create a SQUAD tournament as organiser
    console.log('Logging in as organiser...');
    const logOrgRes = await axios.post('http://localhost:5000/api/auth/login', {
       email: 'testorganiser@gmail.com',
       password: 'password123'
    });
    const orgToken = logOrgRes.data.token;

    console.log('Creating SQUAD tournament...');
    const tourneyRes = await axios.post('http://localhost:5000/api/tournaments/register', {
        tournamentName: 'PRO SERIES SQUAD',
        sportType: 'Cricket',
        registrationFee: 250,
        locationText: 'London',
        type: 'SQUAD',
        teamSize: 11
    }, {
        headers: { Authorization: `Bearer ${orgToken}` }
    });
    console.log('Tournament created:', tourneyRes.data.id);

    // 5. Join tournament as squad
    console.log('Joining tournament as VANGUARD...');
    await axios.post(`http://localhost:5000/api/tournaments/${tourneyRes.data.id}/join`, {
        squadId: squadId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Successfully joined SQUAD tournament.');

    console.log('--- ALL BACKEND CHECKS PASSED ---');
  } catch (err) {
    console.error('Verification failed:', err.response?.data || err.message);
  }
}

verify();
