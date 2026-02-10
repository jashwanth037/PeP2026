const API_URL = 'http://localhost:3000/complaints';

// --- User Page Logic ---
const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
    complaintForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description })
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('statusMessage').innerText = "Complaint Submitted! ID: " + data.id;
                document.getElementById('statusMessage').style.color = "green";
                complaintForm.reset();
            })
            .catch(error => console.error('Error:', error));
    });
}

// --- Admin Page Logic ---
const complaintList = document.getElementById('complaintList');
if (complaintList) {
    // Load on start
    fetchComplaints();
}

function fetchComplaints() {
    if (!complaintList) return;

    complaintList.innerHTML = "Loading...";

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            complaintList.innerHTML = "";
            if (data.length === 0) {
                complaintList.innerHTML = "<p>No complaints yet.</p>";
                return;
            }

            data.forEach(complaint => {
                const div = document.createElement('div');
                div.className = "complaint-card";
                div.innerHTML = `
                <p><strong>ID:</strong> ${complaint.id}</p>
                <h3>${complaint.title}</h3>
                <p>${complaint.description}</p>
                <p>Status: <span class="status-badge status-${complaint.status}">${complaint.status}</span></p>
                <div class="action-buttons">
                    <button class="btn-resolve" onclick="updateStatus(${complaint.id}, 'resolved')">Resolve</button>
                    <button class="btn-reject" onclick="updateStatus(${complaint.id}, 'rejected')">Reject</button>
                    <button class="btn-delete" onclick="deleteComplaint(${complaint.id})">Delete</button>
                </div>
            `;
                complaintList.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            complaintList.innerHTML = "<p>Error connecting to server.</p>";
        });
}

function updateStatus(id, newStatus) {
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => {
            if (response.ok) {
                fetchComplaints(); // Refresh list
            } else {
                alert("Failed to update status");
            }
        });
}

function deleteComplaint(id) {
    if (!confirm("Are you sure?")) return;

    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                fetchComplaints(); // Refresh list
            } else {
                alert("Failed to delete");
            }
        });
}
