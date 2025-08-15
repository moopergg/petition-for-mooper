const el = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    list: document.querySelector('ul'),
    count: document.querySelector('b')
};

function render(supporters) {
    el.list.innerHTML = '';
    el.count.textContent = supporters.length;

    for (const name of supporters) {
        const li = document.createElement('li');
        li.textContent = name;
        el.list.appendChild(li);
    }
}

async function loadSupporters() {
    try {
        const res = await fetch('/api/supporters');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        render(Array.isArray(data.supporters) ? data.supporters : []);
    } catch (err) {
        console.error('Error loading supporters:', err);
    }
}

async function signPetition(event) {
    event.preventDefault();
    const name = el.input.value.trim();
    if (!name) return;

    try {
        const res = await fetch('/api/supporters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (!res.ok) throw new Error('Failed to sign');
        el.input.value = '';
        loadSupporters();
    } catch (err) {
        console.error('Error signing petition:', err);
    }
}

el.form.onsubmit = signPetition;
loadSupporters();
setInterval(loadSupporters, 10000); // refresh every 10 seconds
