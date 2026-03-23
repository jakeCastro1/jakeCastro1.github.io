// event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("input", checkUsername);
document.querySelector("#password").addEventListener("focus", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", function (event) {
    validateForm(event);
});

// call directly on page load for requirement #6
displayStates();

// functions

// displays all US states when page loads
async function displayStates() {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    let stateList = document.querySelector("#state");
    stateList.innerHTML = `<option value="">Select One</option>`;

    for (let i = 0; i < data.length; i++) {
        stateList.innerHTML += `<option value="${data[i].usps}">${data[i].state}</option>`;
    }
}

// display city, latitude, longitude from zip
async function displayCity() {
    let zipCode = document.querySelector("#zip").value.trim();
    let zipError = document.querySelector("#zipError");

    document.querySelector("#city").innerHTML = "";
    document.querySelector("#latitude").innerHTML = "";
    document.querySelector("#longitude").innerHTML = "";
    zipError.innerHTML = "";

    if (zipCode.length === 0) {
        return;
    }

    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    if (!data || !data.city) {
        zipError.innerHTML = "Zip code not found";
        zipError.style.color = "red";
        return;
    }

    document.querySelector("#city").innerHTML = data.city;
    document.querySelector("#latitude").innerHTML = data.latitude;
    document.querySelector("#longitude").innerHTML = data.longitude;
}

// display counties based on state
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let countyList = document.querySelector("#county");

    countyList.innerHTML = `<option value="">Select County</option>`;

    if (state.length === 0) {
        return;
    }

    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option>${data[i].county}</option>`;
    }
}

// check username availability while typing
async function checkUsername() {
    let username = document.querySelector("#username").value.trim();
    let usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.innerHTML = "";
        return;
    }

    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.available) {
        usernameError.innerHTML = "Username available";
        usernameError.style.color = "green";
    } else {
        usernameError.innerHTML = "Username unavailable";
        usernameError.style.color = "red";
    }
}

// suggest password when clicking password box
function suggestPassword() {
    let suggestedPwd = document.querySelector("#suggestedPwd");
    let randomNum = Math.floor(Math.random() * 9000) + 1000;
    suggestedPwd.innerHTML = `Suggested password: csumb${randomNum}`;
    suggestedPwd.style.color = "#1a3c5e";
}

// validate form before going to welcome page
function validateForm(e) {
    let isValid = true;

    let username = document.querySelector("#username").value.trim();
    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#confirmPassword").value;

    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    passwordError.innerHTML = "";

    if (username.length === 0) {
        usernameError.innerHTML = "Username Required!";
        usernameError.style.color = "red";
        isValid = false;
    }

    if (password.length < 6) {
        passwordError.innerHTML = "Password must be at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    } else if (password !== confirmPassword) {
        passwordError.innerHTML = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}