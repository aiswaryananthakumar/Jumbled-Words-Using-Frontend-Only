const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startScan = document.getElementById("startScan");
const jumbledWords = document.getElementById("jumbledWords");
const addStudentBtn = document.getElementById("addStudentBtn");
const studentsList = document.getElementById("studentsList");
const studentsAnswersDiv = document.getElementById("studentsAnswers");
const evaluateAllBtn = document.getElementById("evaluateAllBtn");
const scoresDiv = document.getElementById("scores");
let context = canvas.getContext("2d");

// Dictionary for solving jumbled words
const dictionary = ["apple", "banana", "orange", "grape", "melon", "pear", "kiwi", "mango", "peach", "plum"];
let words = [];

// Access the camera
startScan.addEventListener("click", async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("Oops! Couldn't access your camera.😢");
        }
    }
});

// QR code scanning
video.addEventListener("play", () => {
    const interval = setInterval(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
            words = qrCode.data.split(","); // Assume QR code contains comma-separated jumbled words
            jumbledWords.textContent = `Jumbled Words: ${words.join(", ")}`;
            clearInterval(interval);
        }
    }, 100);
});

// Add a new student
addStudentBtn.addEventListener("click", () => {
    const studentId = `student${studentsList.children.length + 1}`;
    const studentDiv = document.createElement("div");
    studentDiv.className = "student";
    studentDiv.id = studentId;

    studentDiv.innerHTML = `
        <h3>Student ${studentsList.children.length + 1}</h3>
        <button class="removeStudentBtn" onclick="removeStudent('${studentId}')">Remove Student ❌</button>
    `;
    studentsList.appendChild(studentDiv);

    createAnswerSheetForStudent(studentDiv, words);
});

// Remove a student
function removeStudent(studentId) {
    const studentDiv = document.getElementById(studentId);
    studentDiv.remove();
}

// Create answer sheet for a student
function createAnswerSheetForStudent(studentDiv, words) {
    const answersDiv = document.createElement("div");
    words.forEach((word, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
            <label for="${studentDiv.id}_word${index}">Word ${index + 1}:</label>
            <input type="text" id="${studentDiv.id}_word${index}" data-answer="${solveJumbledWord(word)}" placeholder="Your Answer">
        `;
        answersDiv.appendChild(questionDiv);
    });
    studentDiv.appendChild(answersDiv);
}

// Solve jumbled word
function solveJumbledWord(word) {
    const sortedWord = word.split("").sort().join("");
    return dictionary.find(dictWord => sortedWord === dictWord.split("").sort().join("")) || "Unknown";
}

// Evaluate all students' answers
evaluateAllBtn.addEventListener("click", () => {
    const studentDivs = document.querySelectorAll(".student");
    scoresDiv.innerHTML = "";

    studentDivs.forEach((studentDiv, index) => {
        const inputs = studentDiv.querySelectorAll("input");
        let score = 0;

        inputs.forEach(input => {
            const answer = input.dataset.answer;
            if (input.value.toLowerCase() === answer.toLowerCase()) {
                score++;
                input.style.borderColor = "green";
            } else {
                input.style.borderColor = "red";
            }
        });

        const studentScore = document.createElement("p");
        studentScore.textContent = `Student ${index + 1}: ${score}/${inputs.length}`;
        scoresDiv.appendChild(studentScore);
    });
});
