
const token = sessionStorage.getItem("ghost_token");
const user = JSON.parse(
  sessionStorage.getItem("ghost_user") || "null"
);

if (!token || !user) {
  window.location.href = "/";
}

const userName = document.getElementById("userName");
const botList = document.getElementById("botList");
const totalBots = document.getElementById("totalBots");
const runningBots = document.getElementById("runningBots");
const stoppedBots = document.getElementById("stoppedBots");

userName.textContent = user?.name || "User";

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

async function loadBots() {
  try {
    const response = await fetch("/api/bots", {
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not load bots");
    }

    const bots = data.bots || [];

    totalBots.textContent = bots.length;
    runningBots.textContent =
      bots.filter(bot => bot.status === "running").length;
    stoppedBots.textContent =
      bots.filter(bot => bot.status !== "running").length;

    if (bots.length === 0) {
      botList.innerHTML = "<p>No bots found. Create your first bot.</p>";
      return;
    }

    botList.innerHTML = "";

    bots.forEach(bot => {
      const card = document.createElement("div");
      card.className = "bot-card";

      const name = document.createElement("h3");
      name.textContent = bot.bot_name;

      const status = document.createElement("p");
      status.textContent = `Status: ${bot.status}`;

      const id = document.createElement("small");
      id.textContent = `Bot ID: ${bot.id}`;

      card.append(name, status, id);
      botList.appendChild(card);
    });

  } catch (error) {
    botList.textContent = error.message;
  }
}

document.getElementById("addBotButton")
  .addEventListener("click", () => {
    document.getElementById("createBotPanel")
      .classList.toggle("hidden");
  });

document.getElementById("createBotForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const botName = document.getElementById("botName")
      .value.trim();

    const botMessage = document.getElementById("botMessage");
    const submitButton = document.getElementById("createBotSubmit");

    if (!botName) return;

    submitButton.disabled = true;
    botMessage.textContent = "Creating bot...";

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers,
        body: JSON.stringify({
          bot_name: botName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create bot");
      }

      botMessage.textContent = "Bot created successfully!";
      botMessage.style.color = "#20d890";

      event.target.reset();
      await loadBots();

    } catch (error) {
      botMessage.textContent = error.message;
      botMessage.style.color = "#ff5268";
    } finally {
      submitButton.disabled = false;
    }
  });

document.getElementById("logoutButton")
  .addEventListener("click", () => {
    sessionStorage.removeItem("ghost_token");
    sessionStorage.removeItem("ghost_user");
    window.location.href = "/";
  });

loadBots();
