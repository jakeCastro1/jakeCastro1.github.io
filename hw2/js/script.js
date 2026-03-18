// Event Listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

// Live slider display for Q9
document.querySelector("#q9").addEventListener("input", function() {
    document.querySelector("#q9Val").innerHTML = this.value;
});

// Global variables
var score = 0;
var attempts = localStorage.getItem("total_attempts") || 0;

// Display radio choices on page load
displayQ4Choices();
displayQ7Choices();
displayQ10Choices();

// Functions

// Q4 - smallest US state (shuffled using Underscore.js)
function displayQ4Choices() {
    let choices = _.shuffle(["Maine", "Rhode Island", "Maryland", "Delaware"]);
    choices.forEach(function(choice) {
        document.querySelector("#q4Choices").innerHTML +=
            `<div class="form-check">
                <input class="form-check-input" type="radio" name="q4" id="q4_${choice}" value="${choice}">
                <label class="form-check-label" for="q4_${choice}">${choice}</label>
             </div>`;
    });
} // displayQ4Choices

// Q7 - most populous state (shuffled using Underscore.js)
function displayQ7Choices() {
    let choices = _.shuffle(["California", "Texas", "Florida", "New York"]);
    choices.forEach(function(choice) {
        document.querySelector("#q7Choices").innerHTML +=
            `<div class="form-check">
                <input class="form-check-input" type="radio" name="q7" id="q7_${choice}" value="${choice}">
                <label class="form-check-label" for="q7_${choice}">${choice}</label>
             </div>`;
    });
} // displayQ7Choices

// Q10 - ocean bordering East Coast (shuffled using Underscore.js)
function displayQ10Choices() {
    let choices = _.shuffle(["Atlantic Ocean", "Pacific Ocean", "Arctic Ocean", "Indian Ocean"]);
    choices.forEach(function(choice) {
        document.querySelector("#q10Choices").innerHTML +=
            `<div class="form-check">
                <input class="form-check-input" type="radio" name="q10" id="q10_${choice.replace(/ /g,'_')}" value="${choice}">
                <label class="form-check-label" for="q10_${choice.replace(/ /g,'_')}">${choice}</label>
             </div>`;
    });
} // displayQ10Choices

// Validate that Q1 is answered
function isFormValid() {
    if (document.querySelector("#q1").value.trim() == "") {
        let fdbk = document.querySelector("#validationFdbk");
        fdbk.innerHTML = "⚠️ Please answer Question 1 before submitting.";
        fdbk.style.display = "block";
        return false;
    }
    document.querySelector("#validationFdbk").style.display = "none";
    return true;
} // isFormValid

// Mark a question correct (+10 pts)
function rightAnswer(index) {
    let fb = document.querySelector(`#q${index}Feedback`);
    fb.innerHTML = "✅ Correct!";
    fb.className = "feedback-box show bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt='correct'>";
    score += 10;
} // rightAnswer

// Mark a question incorrect (0 pts)
function wrongAnswer(index) {
    let fb = document.querySelector(`#q${index}Feedback`);
    fb.innerHTML = "❌ Incorrect!";
    fb.className = "feedback-box show bg-warning text-dark";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='incorrect'>";
} // wrongAnswer

function gradeQuiz() {
    console.log("Grading quiz...");

    if (!isFormValid()) return;

    // Reset score
    score = 0;

    // --- Q1: Capital of California (text input) ---
    let q1Response = document.querySelector("#q1").value.trim().toLowerCase();
    if (q1Response == "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    // --- Q2: Longest river (dropdown) ---
    let q2Response = document.querySelector("#q2").value;
    if (q2Response == "Missouri") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // --- Q3: Mount Rushmore presidents (checkboxes) ---
    // Correct: Jefferson, Roosevelt, Washington, Lincoln — NOT Jackson or Franklin
    let jeffersonChecked  = document.querySelector("#Jefferson").checked;
    let rooseveltChecked  = document.querySelector("#Roosevelt").checked;
    let washingtonChecked = document.querySelector("#Washington").checked;
    let lincolnChecked    = document.querySelector("#Lincoln").checked;
    let jacksonChecked    = document.querySelector("#Jackson").checked;
    let franklinChecked   = document.querySelector("#Franklin").checked;

    if (jeffersonChecked && rooseveltChecked && washingtonChecked && lincolnChecked
        && !jacksonChecked && !franklinChecked) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // --- Q4: Smallest state (radio, shuffled) ---
    let q4Checked = document.querySelector("input[name=q4]:checked");
    let q4Response = q4Checked ? q4Checked.value : "";
    if (q4Response == "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // --- Q5: Tallest mountain (text input) ---
    let q5Response = document.querySelector("#q5").value.trim().toLowerCase();
    if (q5Response == "denali" || q5Response == "mount denali" || q5Response == "mt denali" || q5Response == "mt. denali") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // --- Q6: Most national parks (dropdown) ---
    let q6Response = document.querySelector("#q6").value;
    if (q6Response == "California") {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    // --- Q7: Most populous state (radio, shuffled) ---
    let q7Checked = document.querySelector("input[name=q7]:checked");
    let q7Response = q7Checked ? q7Checked.value : "";
    if (q7Response == "California") {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // --- Q8: State capitals (checkboxes) ---
    // Correct: Austin (TX) and Albany (NY) — NOT Los Angeles or Miami
    let austinChecked = document.querySelector("#Austin").checked;
    let albanyChecked = document.querySelector("#Albany").checked;
    let laChecked     = document.querySelector("#LosAngeles").checked;
    let miamiChecked  = document.querySelector("#Miami").checked;

    if (austinChecked && albanyChecked && !laChecked && !miamiChecked) {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    // --- Q9: Number of US states (range slider) ---
    let q9Response = parseInt(document.querySelector("#q9").value);
    if (q9Response == 50) {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    // --- Q10: Ocean bordering East Coast (radio, shuffled) ---
    let q10Checked = document.querySelector("input[name=q10]:checked");
    let q10Response = q10Checked ? q10Checked.value : "";
    if (q10Response == "Atlantic Ocean") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    // --- Display total score with color ---
    let totalScoreEl = document.querySelector("#totalScore");
    totalScoreEl.innerHTML = `Total Score: ${score} / 100`;
    totalScoreEl.className = score >= 80 ? "text-success" : "text-danger";

    // --- Congratulatory message if score > 80 ---
    let congratsEl = document.querySelector("#congratsMsg");
    if (score > 80) {
        congratsEl.innerHTML = "🎉 Congratulations! Outstanding work!";
        congratsEl.className = "text-success";
    } else {
        congratsEl.innerHTML = "Keep studying and try again!";
        congratsEl.className = "text-muted";
    }

    // --- Update and save attempts using Web Storage ---
    attempts++;
    document.querySelector("#totalAttempts").innerHTML = `🗓️ Total Times Taken: ${attempts}`;
    localStorage.setItem("total_attempts", attempts);

    // Show scoreboard
    document.querySelector("#scoreboard").style.display = "block";
    document.querySelector("#scoreboard").scrollIntoView({ behavior: "smooth" });

} // gradeQuiz