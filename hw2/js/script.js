//Event Listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

//Global variables
var score = 0;
var attempts = localStorage.getItem("total_attempts");

displayQ4Choices();

//Functions
function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    for (let i=0; i < q4ChoicesArray.length; i++) {
        document.querySelector("#q4Choices").innerHTML += `<input type="radio" name="q4" id="${q4ChoicesArray[i]}" value="${q4ChoicesArray[i]}"><label for="${q4ChoicesArray[i]}">${q4ChoicesArray[i]}</label>`;
    }
}//displayQ4Choices

function isFormValid(){
    let isValid= true;
    if(document.querySelector("#q1").value == ""){
        isValid = false;
        document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered";
    }
    return isValid;
} //isFormValid

function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png'>";
    score += 20;
}

function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='xmark'>";
}
function gradeQuiz() {
    console.log("Grading quiz..");
    document.querySelector("#validationFdbk").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    //variables
    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;
    console.log(q1Response);

    //grading question 1
    if (q1Response == "sacramento") {
        rightAnswer(1);
    }
    else {
        wrongAnswer(1);
    }

    //grading question 2
    if (q2Response == "Missouri") {
        rightAnswer(2);
    }
    else {
        wrongAnswer(2);
    }

    //grading question 3
    if (document.querySelector("#Jefferson").checked && document.querySelector("#Roosevelt").checked && !document.querySelector("#Jackson").checked && !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    }
    else {
        wrongAnswer(3);
    }

    //grading question 4
    let q4Checked = document.querySelector("input[name=q4]:checked");
    let q4Response = q4Checked ? q4Checked.value : "";
    if(q4Response == "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Display total score with color based on performance
    let totalScoreEl = document.querySelector("#totalScore");
    totalScoreEl.innerHTML = `Total Score: ${score}%`;
    if (score >= 80) {
        totalScoreEl.className = "text-success";
    } else {
        totalScoreEl.className = "text-danger";
    }

    // Display congratulatory message if score > 80
    let congratsEl = document.querySelector("#congratsMsg");
    if (score > 80) {
        congratsEl.innerHTML = "🎉 Congratulations! Excellent work!";
    } else {
        congratsEl.innerHTML = "";
    }

    document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${++attempts}`;
    localStorage.setItem("total_attempts", attempts);

}//gradeQuiz