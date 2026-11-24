const authForm = document.getElementById("authForm");
const nameField = document.getElementById("nameField");
const formTitle = document.getElementById("formTitle");
const formDescription = document.getElementById("formDescription");
const submitButton = document.getElementById("submitButton");
const switchButton = document.getElementById("switchButton");
const switchText = document.getElementById("switchText");
const message = document.getElementById("message");

let isRegistering = false;

switchButton.addEventListener("click", () => {
  isRegistering = !isRegistering;

  nameField.classList.toggle("hidden", !isRegistering);

  formTitle.textContent = isRegistering
    ? "Create Account"
    : "Welcome Back";

  formDescription.textContent = isRegistering
    ? "Register your hosting account"
    : "Login to your hosting account";

  submitButton.textContent = isRegistering
    ? "REGISTER"
    : "LOGIN";

  switchText.textContent = isRegistering
    ? "Already have an account?"
    : "Don't have an account?";

  switchButton.textContent = isRegistering
    ? "Login"
    : "Create Account";

  message.textContent = "";
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Please wait...";
  submitButton.disabled = true;

  const endpoint = isRegistering
    ? "/api/auth/register"
    : "/api/auth/login";

  const payload = isRegistering
    ? { name, email, password }
    : { email, password };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    if (!isRegistering && data.token) {
      sessionStorage.setItem("ghost_token", data.token);
      sessionStorage.setItem(
        "ghost_user",
        JSON.stringify(data.user)
      );

      window.location.href = "/dashboard.html";
      return;
    }

    message.style.color = "#20d890";
    message.textContent =
      "Account created successfully. You can now login.";

    authForm.reset();

    switchButton.click();

  } catch (error) {
    message.style.color = "#ff5268";
    message.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});
