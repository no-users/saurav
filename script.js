
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWyMJvt0OpejwkFEstI_NQToHmMBGwkbE",
    authDomain: "agency-136b6.firebaseapp.com",
    projectId: "agency-136b6",
    databaseURL: "https://agency-136b6-default-rtdb.firebaseio.com", 
    storageBucket: "agency-136b6.firebasestorage.app",
    messagingSenderId: "503663950718",
    appId: "1:503663950718:web:8a30b18039c279ffac112f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 💰 LIVE BALANCE UPDATE
onValue(ref(db, 'wallet/balance'), (snapshot) => {
    const data = snapshot.val();
    if (data !== null) document.querySelector('.wallet-balance').innerText = "💰 ₹" + data;
});

// 🔓 MODAL OPEN/CLOSE LOGIC
const modal = document.getElementById('addMoneyModal');
const openBtn = document.querySelector('.add-money-btn');
const closeBtn = document.getElementById('closeAddMoney');

openBtn.addEventListener('click', () => {
    console.log("Pop-up khul raha hai...");
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 🚀 DATA SUBMIT LOGIC
// 1. UPI ID Copy Logic
document.getElementById('copyUpi').addEventListener('click', () => {
    const upiText = document.getElementById('upiId').innerText;
    navigator.clipboard.writeText(upiText).then(() => {
        alert("UPI ID Copied: " + upiText);
    });
});

// 2. UTR Live Validation (12 Digits Check)
const utrInput = document.getElementById('utrNumber');
utrInput.addEventListener('input', (e) => {
    if (e.target.value.length === 12) {
        utrInput.classList.add('valid-input');
    } else {
        utrInput.classList.remove('valid-input');
    }
});
const submitBtn = document.getElementById('submitDeposit');

submitBtn.addEventListener('click', () => {
    const amt = document.getElementById('depositAmount').value;
    const utr = document.getElementById('utrNumber').value;

    if(amt > 0 && utr.length === 12) {
        // Button ko Loading mode mein daalein
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.classList.add('btn-loading');
       // Firebase mein data bhejna (Set code...)
        set(push(ref(db, 'deposits')), {
            amount: parseInt(amt),
            utr: utr,
            status: 'pending',
            timestamp: Date.now()
        }).then(() => {
            alert("✅ Request Sent Successfully!");
            // Reset button and close modal
            submitBtn.innerHTML = 'Submit Request';
            submitBtn.classList.remove('btn-loading');
            addMoneyModal.style.display = 'none';
        }).catch((err) => {
            alert("Error: " + err.message);
            submitBtn.innerHTML = 'Submit Request';
            submitBtn.classList.remove('btn-loading');
        });
    } else {
        alert("Kripya 12 digit ka sahi UTR number bhariye.");
    }
});

// --- STEP 5: UI FEATURES (CLOCK, SEARCH, DARK MODE) ---

// Live Clock & Greeting
function updateClockAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    
    // Greeting
    const greetingElement = document.getElementById('greeting');
    if (hours < 12) greetingElement.innerText = "☀️ Good Morning, Shubh Prabhat!";
    else if (hours < 17) greetingElement.innerText = "🌤️ Good Afternoon!";
    else greetingElement.innerText = "🌙 Good Evening, Shubh Sandhya!";

    // Clock
    const timeString = now.toLocaleString('en-IN', { 
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
    });
    document.getElementById('live-clock').innerText = timeString;
}
setInterval(updateClockAndGreeting, 1000);
updateClockAndGreeting();

// Search System
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.card');

searchInput.addEventListener('keyup', () => {
    let filter = searchInput.value.toLowerCase();
    cards.forEach(card => {
        let title = card.querySelector('h4').innerText.toLowerCase();
        card.style.display = title.includes(filter) ? "flex" : "none";
    });
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
        themeIcon.style.color = "#ffc107";
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.style.color = "white";
    }
});

// --- STEP 6: SERVICE CARDS MODAL ---
const serviceModal = document.getElementById('serviceModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

const serviceData = {
    "USER COMPLAINTS": "Aapki saari shikayatein yahan darj hain. Kul shikayatein: 6",
    "COMPLAINTS HISTORY": "Pichli 100 shikayaton ka poora hisab-kitab yahan dekhein.",
    "ACCOUNT OPENING": "NSDL Payment Bank mein 0 balance account kholne ke liye niche click karein.",
    "ADD MONEY": "Apne wallet mein paise jodne ke liye QR code scan karein.",
    "NSDL EKYC PAN": "Bina signature wala naya PAN card sirf 2 ghante mein payein.",
    "FIND PAN": "Apna khoya hua PAN number turant dhoondhein.",
    "VEHICLE INSURANCE": "Bike aur Car ka insurance turant karein aur commission payein.",
    "TRAINING": "Portal use karne ki poori jankari in video tutorials mein hai."
};

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const name = card.querySelector('h4').innerText;
        
        // Agar "ADD MONEY" card dabaya, toh wallet modal kholo
        if (name === "ADD MONEY") {
            addMoneyModal.style.display = 'block';
        } else {
            modalTitle.innerText = name;
            modalDesc.innerText = serviceData[name] || "Jankari jald hi jodi jayegi.";
            serviceModal.style.display = "block";
        }
    });
});

closeModal.addEventListener('click', () => { serviceModal.style.display = "none"; });
//


// 1. Live Wallet Balance Update
onValue(ref(db, 'wallet/balance'), (snapshot) => {
    const balance = snapshot.val() || 0;
    document.querySelector('.wallet-balance').innerText = "💰 ₹" + balance;
});

// 2. My Deposits History (User Side)
const userTableBody = document.getElementById('userDepositTable');

onValue(ref(db, 'deposits'), (snapshot) => {
    userTableBody.innerHTML = "";
    
    // Sirf pichli 5 requests dikhane ke liye reverse loop
    let requests = [];
    snapshot.forEach((child) => {
        requests.push(child.val());
    });
    
    requests.reverse().slice(0, 3).forEach((data) => {
        let statusClass = 'status-pending';
        if(data.status === 'approved') statusClass = 'status-approved';
        if(data.status === 'rejected') statusClass = 'status-rejected';

        userTableBody.innerHTML += `
            <tr>
                <td>${new Date(data.timestamp).toLocaleDateString()}</td>
                <td>₹${data.amount}</td>
                <td><code>${data.utr}</code></td>
                <td><span class="status-tag ${statusClass}">${data.status.toUpperCase()}</span></td>
            </tr>
        `;
    });
});

///
// 1. Modal Toggle
const historyModal = document.getElementById('historyModal');
const balanceBtn = document.getElementById('balanceBtn');
const closeHistory = document.getElementById('closeHistory');

if(balanceBtn) {
    balanceBtn.onclick = () => { historyModal.style.display = 'block'; };
}
if(closeHistory) {
    closeHistory.onclick = () => { historyModal.style.display = 'none'; };
}

// 2. Load Data & Filter Logic
let transactions = [];
onValue(ref(db, 'deposits'), (snapshot) => {
    transactions = [];
    const fullBody = document.getElementById('fullHistoryTableBody');
    fullBody.innerHTML = "";
    
    snapshot.forEach(child => { transactions.push(child.val()); });
    renderHistoryTable(transactions.reverse());
});

function renderHistoryTable(data) {
    const fullBody = document.getElementById('fullHistoryTableBody');
    fullBody.innerHTML = "";
    data.forEach(item => {
        fullBody.innerHTML += `
            <tr>
                <td>${new Date(item.timestamp).toLocaleString()}</td>
                <td>₹${item.amount}</td>
                <td><code>${item.utr}</code></td>
                <td><span class="status-tag status-${item.status.toUpperCase()}">${item.status.toUpperCase()}</span></td>
            </tr>`;
    });
}

// PDF Download Logic (The Professional Way)
document.getElementById('downloadBtn').onclick = () => {
    // 1. Library ko active karein
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 2. Header Design (PDF ke upar ka hissa)
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("APNA AGENCY", 14, 20);
    
    doc.setFontSize(10);
    doc.text("Transaction Statement", 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 28);
    
    // Line draw karna
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // 3. Table Rows tayyar karna (Sikhne wali baat: Map function asaan hota hai)
    const tableData = transactions.map(t => [
        new Date(t.timestamp).toLocaleString(),
        `Rs. ${t.amount}`,
        t.utr,
        t.status.toUpperCase()
    ]);

    // 4. AutoTable chalu karna
    doc.autoTable({
        startY: 35,
        head: [['Date & Time', 'Amount', 'UTR Number', 'Status']],
        body: tableData,
        theme: 'striped', // Excel jaisa look
        headStyles: { fillColor: [67, 24, 255], textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 5 }
    });

    // 5. Final Download
    doc.save(`Statement_${Date.now()}.pdf`);
};


// 5. logout 



// Saare Profile Modal ke buttons ko ek saath handle karna
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Elements ko select karein
    const profileModal = document.getElementById('profileModal');
    const profileBtn = document.getElementById('profileSettingsBtn'); // Navbar wala button
    const closeProfile = document.getElementById('closeProfile');
    const saveProfile = document.getElementById('saveProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // 2. Modal kholne ka logic
    if (profileBtn && profileModal) {
        profileBtn.onclick = (e) => {
            e.preventDefault();
            profileModal.style.display = 'block';
            console.log("Profile Modal Opened!");
        };
    }

    // 3. Modal band karne ka logic
    if (closeProfile && profileModal) {
        closeProfile.onclick = () => {
            profileModal.style.display = 'none';
        };
    }

    // 4. Update Button Logic
    if (saveProfile) {
        saveProfile.onclick = async () => {
            const name = document.getElementById('updateName').value;
            // ... Yahan aapka firebase update logic ...
            alert("✅ Details saved for: " + name);
            profileModal.style.display = 'none';
        };
    }

    // 5. Logout Button Logic
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if(confirm("Exit hona chahte hain?")) {
                window.location.href = "login.html";
            }
        };
    }

    // Window ke bahar click karne par modal band ho jaye
    window.onclick = (event) => {
        if (event.target == profileModal) {
            profileModal.style.display = "none";
        }
    };
});


/// ceartificate

// Dashboard ki script.js mein
const certBtn = document.getElementById('viewCertificate');

if (certBtn) {
    certBtn.onclick = () => {
        // window.open se naye tab mein khulega (Professional feeling)
        window.open('ceartificate.html', '_blank'); 
        
        // Agar aap chahte hain ki usi page par khule toh niche wala use karein:
        window.location.href = 'ceartificate.html';
    };
}

/// ceartificate close button 

// recharge option 

// Modal kholne ka logic
const meterBtn = document.getElementById('meterRechargeBtn');
const rechargeModal = document.getElementById('rechargeModal');
const closeRecharge = document.getElementById('closeRecharge');

if (meterBtn && rechargeModal) {
    meterBtn.onclick = () => {
        rechargeModal.style.display = 'block';
    };
}

// Modal band karne ka logic
if (closeRecharge) {
    closeRecharge.onclick = () => {
        rechargeModal.style.display = 'none';
    };
}