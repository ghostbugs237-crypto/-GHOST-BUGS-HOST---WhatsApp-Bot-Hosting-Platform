
const uploadForm = document.getElementById("uploadForm");
const message = document.getElementById("message");

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const botName = document.getElementById("botName").value.trim();
    const botFile = document.getElementById("botFile").files[0];

    if (!botName || !botFile) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (!botFile.name.toLowerCase().endsWith(".zip")) {
        message.textContent = "Only ZIP files are allowed.";
        return;
    }

    if (botFile.size > 50 * 1024 * 1024) {
        message.textContent = "File must not exceed 50 MB.";
        return;
    }

    const formData = new FormData();
    formData.append("botName", botName);
    formData.append("botFile", botFile);

    message.textContent = "Preparing upload...";

    try {
        const response = await fetch("/api/bots/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        message.textContent = result.message ||
            (response.ok ? "Upload successful!" : "Upload failed.");

    } catch (error) {
        message.textContent = "Server connection failed.";
    }
});
  
