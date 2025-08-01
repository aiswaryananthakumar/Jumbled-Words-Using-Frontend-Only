const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const result = document.getElementById("result");
const solvedWord = document.getElementById("solvedWord");
const startScan = document.getElementById("startScan");
let context = canvas.getContext("2d");

// Predefined dictionary for solving jumbled words
const dictionary = ["apple", "banana", "orange", "grape", "melon", "pear"];

function solveJumbledWord(word) {
    // Compare with dictionary words
    const sortedWord = word.split("").sort().join("");
    for (const dictWord of dictionary) {
        if (sortedWord === dictWord.split("").sort().join("")) {
            return dictWord;
        }
    }
    return "No match found!";
}

startScan.addEventListener("click", async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error("Error accessing camera: ", err);
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
            result.textContent = `Scanned Text: ${qrCode.data}`;
            const solution = solveJumbledWord(qrCode.data);
            solvedWord.textContent = `Solved Word: ${solution}`;
            clearInterval(interval);
        }
    }, 100);
});
