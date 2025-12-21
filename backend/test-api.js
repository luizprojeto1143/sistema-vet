// Using native fetch

async function main() {
    const API_URL = 'http://localhost:4000';

    console.log('1. Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@vet.com', password: '123456' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('Login successful. Token obtained.');

    console.log('2. Fetching Wards...');
    const wardsRes = await fetch(`${API_URL}/internment/wards`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!wardsRes.ok) {
        console.error('Fetch Wards failed:', await wardsRes.text());
        return;
    }

    const wards = await wardsRes.json();
    console.log('Wards fetched successfully:');
    console.log(JSON.stringify(wards, null, 2));
}

main().catch(console.error);
