const API_URL = '/complaints';

document.addEventListener('DOMContentLoaded', () => {
    const complaintForm = document.getElementById('complaintForm');
    const messageDiv = document.getElementById('message');

    if (complaintForm) {
        complaintForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.innerHTML = `<span style="color: green;">Submitted! ID: ${data.id}</span>`;
                    complaintForm.reset();
                } else {
                    messageDiv.innerHTML = `<span style="color: red;">${data.message}</span>`;
                }
            } catch (err) {
                console.error(err);
                messageDiv.innerHTML = '<span style="color: red;">Error connecting to server.</span>';
            }
        });
    }

    const complaintList = document.getElementById('complaintList');
    if (complaintList) {
        fetchComplaints();
        document.getElementById('refreshBtn').onclick = fetchComplaints;
    }
});

async function fetchComplaints() {
    const list = document.getElementById('complaintList');
    if (!list) return;

    list.innerHTML = 'Loading...';

    try {
        const res = await fetch('/complaints');
        const data = await res.json();
        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = '<p>No complaints yet.</p>';
            return;
        }

        data.forEach(c => {
            const div = document.createElement('div');
            div.className = 'complaint-card';
            div.innerHTML = `
                <h3>#${c.id} - ${c.title}</h3>
                <p><strong>From:</strong> ${c.email} | <strong>Phone:</strong> ${c.phone}</p>
                <p>${c.description}</p>
                <p>Status: <span class="status-tag status-${c.status}">${c.status}</span></p>
                <div class="card-actions">
                    <select onchange="updateStatus(${c.id}, this.value)">
                        <option value="pending" ${c.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="resolved" ${c.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="rejected" ${c.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                    <button class="btn-delete" onclick="deleteComplaint(${c.id})">Delete</button>
                </div>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        list.innerHTML = '<p style="color: red;">Failed to load.</p>';
    }
}

async function updateStatus(id, newStatus) {
    try {
        await fetch(`/complaints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchComplaints();
    } catch (err) {
        console.error(err);
    }
}

async function deleteComplaint(id) {
    if (!confirm('Are you sure?')) return;
    try {
        await fetch(`/complaints/${id}`, { method: 'DELETE' });
        fetchComplaints();
    } catch (err) {
        console.error(err);
    }
}
