// =====================================
// BLOOD BANK MANAGEMENT SYSTEM
// JavaScript Functionality
// =====================================

// Data Storage
let donors = JSON.parse(localStorage.getItem("donors")) || [];
let donations = JSON.parse(localStorage.getItem("donations")) || [];
let hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];

// Save Data
function saveData() {
    localStorage.setItem("donors", JSON.stringify(donors));
    localStorage.setItem("donations", JSON.stringify(donations));
    localStorage.setItem("hospitals", JSON.stringify(hospitals));
    localStorage.setItem("requests", JSON.stringify(requests));
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }
}

// Dashboard
function updateDashboard() {
    document.getElementById("donorCount").textContent = donors.length;

    document.getElementById("donationCount").textContent =
        donations.length;

    let totalUnits = donations.reduce(
        (sum, donation) => sum + Number(donation.units), 0
    );

    document.getElementById("unitCount").textContent = totalUnits;

    let pending = requests.filter(
        request => request.status === "Pending"
    ).length;

    document.getElementById("pendingCount").textContent = pending;
}

// =====================================
// DONOR MANAGEMENT
// =====================================

const donorForm = document.getElementById("donorForm");

donorForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const donor = {
        id: Date.now(),
        name: document.getElementById("donorName").value.trim(),
        group: document.getElementById("bloodGroup").value,
        age: document.getElementById("donorAge").value,
        city: document.getElementById("donorCity").value.trim(),
        phone: document.getElementById("donorPhone").value.trim()
    };

    donors.push(donor);

    saveData();
    displayDonors();
    updateDashboard();

    donorForm.reset();

    alert("Donor added successfully!");
});

function displayDonors() {
    const table = document.getElementById("donorTable");

    table.innerHTML = "";

    donors.forEach(donor => {
        table.innerHTML += `
            <tr>
                <td>${donor.name}</td>
                <td>${donor.group}</td>
                <td>${donor.age}</td>
                <td>${donor.city}</td>
                <td>${donor.phone}</td>
                <td>
                    <button onclick="deleteDonor(${donor.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteDonor(id) {
    if (confirm("Are you sure you want to delete this donor?")) {
        donors = donors.filter(donor => donor.id !== id);

        saveData();
        displayDonors();
        updateDashboard();

        alert("Donor deleted successfully!");
    }
}

// =====================================
// SEARCH DONORS
// =====================================

function searchDonors() {
    const searchValue = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();

    const results = document.getElementById("searchResults");

    results.innerHTML = "";

    const matchedDonors = donors.filter(donor =>
        donor.group.toLowerCase().includes(searchValue) ||
        donor.city.toLowerCase().includes(searchValue) ||
        donor.name.toLowerCase().includes(searchValue)
    );

    if (matchedDonors.length === 0) {
        results.innerHTML = `
            <tr>
                <td colspan="5">No donors found.</td>
            </tr>
        `;
        return;
    }

    matchedDonors.forEach(donor => {
        results.innerHTML += `
            <tr>
                <td>${donor.name}</td>
                <td>${donor.group}</td>
                <td>${donor.city}</td>
                <td>${donor.phone}</td>
                <td>${donor.age}</td>
            </tr>
        `;
    });
}

// =====================================
// DONATION MANAGEMENT
// =====================================

const donationForm = document.getElementById("donationForm");

donationForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const donation = {
        id: Date.now(),
        donor: document.getElementById("donationDonor").value.trim(),
        group: document.getElementById("donationGroup").value,
        units: Number(document.getElementById("donationUnits").value),
        date: document.getElementById("donationDate").value
    };

    if (donation.units <= 0) {
        alert("Please enter a valid number of units.");
        return;
    }

    donations.push(donation);

    saveData();
    displayDonations();
    displayStock();
    updateDashboard();

    donationForm.reset();

    alert("Donation recorded successfully!");
});

function displayDonations() {
    const table = document.getElementById("donationTable");

    table.innerHTML = "";

    donations.forEach(donation => {
        table.innerHTML += `
            <tr>
                <td>${donation.donor}</td>
                <td>${donation.group}</td>
                <td>${donation.units}</td>
                <td>${donation.date}</td>
            </tr>
        `;
    });
}

// =====================================
// BLOOD STOCK MANAGEMENT
// =====================================

function displayStock() {
    const table = document.getElementById("stockTable");

    const groups = [
        "A+", "A-", "B+", "B-",
        "AB+", "AB-", "O+", "O-"
    ];

    table.innerHTML = "";

    groups.forEach(group => {
        const total = donations
            .filter(donation => donation.group === group)
            .reduce((sum, donation) => sum + donation.units, 0);

        const used = requests
            .filter(request =>
                request.group === group &&
                request.status === "Approved"
            )
            .reduce((sum, request) => sum + request.units, 0);

        const available = total - used;

        table.innerHTML += `
            <tr>
                <td>${group}</td>
                <td>${total}</td>
                <td>${used}</td>
                <td>${available}</td>
            </tr>
        `;
    });
}

// =====================================
// HOSPITAL MANAGEMENT
// =====================================

const hospitalForm = document.getElementById("hospitalForm");

hospitalForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const hospital = {
        id: Date.now(),
        name: document.getElementById("hospitalName").value.trim(),
        city: document.getElementById("hospitalCity").value.trim(),
        phone: document.getElementById("hospitalPhone").value.trim()
    };

    hospitals.push(hospital);

    saveData();
    displayHospitals();

    hospitalForm.reset();

    alert("Hospital added successfully!");
});

function displayHospitals() {
    const table = document.getElementById("hospitalTable");

    table.innerHTML = "";

    hospitals.forEach(hospital => {
        table.innerHTML += `
            <tr>
                <td>${hospital.name}</td>
                <td>${hospital.city}</td>
                <td>${hospital.phone}</td>
                <td>
                    <button onclick="deleteHospital(${hospital.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteHospital(id) {
    if (confirm("Delete this hospital?")) {
        hospitals = hospitals.filter(
            hospital => hospital.id !== id
        );

        saveData();
        displayHospitals();
    }
}

// =====================================
// BLOOD REQUEST MANAGEMENT
// =====================================

const requestForm = document.getElementById("requestForm");

requestForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const request = {
        id: Date.now(),
        hospital: document.getElementById("requestHospital").value.trim(),
        group: document.getElementById("requestGroup").value,
        units: Number(document.getElementById("requestUnits").value),
        status: "Pending"
    };

    if (request.units <= 0) {
        alert("Please enter a valid number of units.");
        return;
    }

    requests.push(request);

    saveData();
    displayRequests();
    displayStock();
    updateDashboard();

    requestForm.reset();

    alert("Blood request submitted successfully!");
});

function displayRequests() {
    const table = document.getElementById("requestTable");

    table.innerHTML = "";

    requests.forEach(request => {
        table.innerHTML += `
            <tr>
                <td>${request.hospital}</td>
                <td>${request.group}</td>
                <td>${request.units}</td>
                <td>${request.status}</td>
                <td>
                    ${
                        request.status === "Pending"
                        ? `
                            <button onclick="approveRequest(${request.id})">
                                Approve
                            </button>

                            <button class="reject"
                                onclick="rejectRequest(${request.id})">
                                Reject
                            </button>
                        `
                        : "Completed"
                    }
                </td>
            </tr>
        `;
    });
}

// Approve Request
function approveRequest(id) {
    const request = requests.find(item => item.id === id);

    if (!request) return;

    const available = donations
        .filter(donation => donation.group === request.group)
        .reduce((sum, donation) => sum + donation.units, 0);

    const alreadyUsed = requests
        .filter(item =>
            item.group === request.group &&
            item.status === "Approved"
        )
        .reduce((sum, item) => sum + item.units, 0);

    if (request.units > available - alreadyUsed) {
        alert("Not enough blood units available!");
        return;
    }

    request.status = "Approved";

    saveData();
    displayRequests();
    displayStock();
    updateDashboard();

    alert("Request approved successfully!");
}

// Reject Request
function rejectRequest(id) {
    const request = requests.find(item => item.id === id);

    if (!request) return;

    request.status = "Rejected";

    saveData();
    displayRequests();
    updateDashboard();

    alert("Request rejected!");
}

// =====================================
// LOAD ALL DATA WHEN PAGE OPENS
// =====================================

function initializeSystem() {
    displayDonors();
    displayDonations();
    displayStock();
    displayHospitals();
    displayRequests();
    updateDashboard();
}

initializeSystem();