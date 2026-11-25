
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("upload-app") || document.body;

  app.innerHTML = `
    <div class="upload-container">
      <h2>GHOST BUGS HOST</h2>
      <h3>Upload Your Bot</h3>

      <p>Select your bot ZIP file to upload.</p>

      <form id="uploadForm">
        <input
          type="file"
          id="botFile"
          accept=".zip,application/zip"
          required
        />

        <button type="submit" id="uploadButton">
          Upload Bot
        </button>
      </form>

      <p id="uploadStatus"></p>
    </div>
  `;

  const form = document.getElementById("uploadForm");
  const fileInput = document.getElementById("botFile");
  const button = document.getElementById("uploadButton");
  const status = document.getElementById("uploadStatus");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
      status.textContent = "Please select a ZIP file.";
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      status.textContent = "Only ZIP files are allowed.";
      return;
    }

    // Backend upload limit: 100 MB
    if (file.size > 100 * 1024 * 1024) {
      status.textContent = "File must not exceed 100 MB.";
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!token) {
      status.textContent = "Please login before uploading.";
      return;
    }

    const formData = new FormData();
    formData.append("botFile", file);

    button.disabled = true;
    button.textContent = "Uploading...";
    status.textContent = "Please wait while your bot uploads.";

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed.");
      }

      status.textContent =
        "Upload successful! File: " + result.file.name;

      fileInput.value = "";

    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = "Upload Bot";
    }
  });
});
