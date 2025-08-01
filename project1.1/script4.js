const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const result = document.getElementById("result");
const solvedWord = document.getElementById("solvedWord");
const startScan = document.getElementById("startScan");
let context = canvas.getContext("2d");

// Predefined dictionary for solving jumbled words
const dictionary = ["apple", "banana", "orange", "grape", "melon", "pear", "kiwi", "mango", "peach", "plum"];

function solveJumbledWord(word) {
    // Compare with dictionary words
    const sortedWord = word.split("").sort().join("");
    for (const dictWord of dictionary) {
        if (sortedWord === dictWord.split("").sort().join("")) {
            return dictWord;
        }
    }
    return "Oops! No match found! Try again!";
}

startScan.addEventListener("click", async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.play();

            // Fun alert for kids
            alert("📸Ready, Set, Scan! 🎯 The camera is ready to scan!");
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("Oh no! 😟 We couldn't access your camera.");
        }
    }
});

video.addEventListener("play", () => {
    const interval = setInterval(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Decode QR Code using jsQR
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
            // Show scanned text
            result.textContent = `Scanned Text: ${qrCode.data}`;
            result.style.backgroundColor = "#FFD700";

            // Solve the jumbled word
            const solution = solveJumbledWord(qrCode.data);
            solvedWord.textContent = `Solved Word: ${solution}`;
            solvedWord.style.backgroundColor = solution.includes("Oops") ? "#FF6347" : "#7CFC00"; // Red for no match, green for success

            // Fun alert for solved word
            if (!solution.includes("Oops")) {
                alert(`🎉 Hooray! The word is "${solution}". Great job!🎉`);
            } else {
                alert("😟 Hmm, that word isn't in our list. Try again!");
            }

            clearInterval(interval);
        }
    }, 100);
});
