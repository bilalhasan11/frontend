const API_URL = "https://healthy-not-healthy-database.onrender.com";

async function signup() {
    const fullName = document.getElementById("signupFullName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    if (!fullName || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
    });
    const result = await response.text();
    alert(result);
}

async function login() {
    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("loginPassword").value;
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        window.location.href = "profile.html";
    } else {
        alert(data.error);
    }
}

function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
}

async function predict(event) {
    event.preventDefault();
    const userId = localStorage.getItem("user_id");
    const audio = document.getElementById("audio").files[0];
    const formData = new FormData();
    formData.append("audio", audio);
    formData.append("user_id", userId);

    const response = await fetch(`${API_URL}/predict`, { method: "POST", body: formData });
    const result = await response.json();
    document.getElementById("result").innerText = `Result: ${result.result}`;
}

async function fetchHistory() {
    const userId = localStorage.getItem("user_id");
    const response = await fetch(`${API_URL}/history?user_id=${userId}`);
    const data = await response.json();
    
    document.getElementById("historyBody").innerHTML = data.history.map(entry =>
        `<tr><td>${entry.timestamp}</td><td>${entry.audio_name}</td><td>${entry.result}</td></tr>`
    ).join("");
}
