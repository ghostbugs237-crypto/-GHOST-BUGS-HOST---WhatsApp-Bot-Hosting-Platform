
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
        message.textContent = "Maximum file size is 50 MB.";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        message.textContent = "Please login first.";
        return;
    }

    const formData = new FormData();
    formData.append("botFile", botFile);

    message.textContent = "Uploading...";

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Upload failed.");
        }

        message.textContent = result.message;

        uploadForm.reset();

    } catch (error) {
        message.textContent = error.message;
    }
});
