const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const photosContainer = document.getElementById("photos");
let context = canvas.getContext("2d");
let capturedPhotos = []; // Array to store captured photos

// Access the camera
async function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("Oh no! We couldn't access your camera.😢");
        }
    }
}

// Capture photo and save it in memory
captureBtn.addEventListener("click", () => {
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame on canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image data URL
    const photo = canvas.toDataURL("image/png");
    capturedPhotos.push(photo); // Store photo in memory

    // Display the photo in the gallery
    const imgElement = document.createElement("img");
    imgElement.src = photo;
    photosContainer.appendChild(imgElement);

    alert("Snapshot code captured!📸 Check out your answer sheet!");
});

// Start the camera on page load
startCamera();

