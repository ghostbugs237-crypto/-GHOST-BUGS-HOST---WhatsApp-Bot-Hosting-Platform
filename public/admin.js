
const token = sessionStorage.getItem("ghost_token");

if (!token) {
  window.location.href = "/";
}

const headers = {
  "Authorization": `Bearer ${token}`
};

async function loadAdminData() {
  const message = document.getElementById("adminMessage");
  const userList = document.getElementById("userList");

  try {
    const response = await fetch("/api/admin/overview", {
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Admin access denied");
    }

    document.getElementById("totalUsers").textContent =
      data.statistics.totalUsers;

    document.getElementById("totalBots").textContent =
      data.statistics.totalBots;

    document.getElementById("runningBots").textContent =
      data.statistics.runningBots;

    const usersResponse = await fetch("/api/admin/users", {
      headers
    });

    const usersData = await usersResponse.json();

    if (!usersResponse.ok) {
      throw new Error(usersData.message || "Could not load users");
    }

    userList.innerHTML = "";

    usersData.users.forEach(user => {
      const item = document.createElement("div");
      item.className = "bot-card";

      const name = document.createElement("h3");
      name.textContent = user.name;

      const email = document.createElement("p");
      email.textContent = user.email;

      const role = document.createElement("small");
      role.textContent = `Role: ${user.role}`;

      item.append(name, email, role);
      userList.appendChild(item);
    });

    message.textContent = "Admin data loaded successfully.";
    message.style.color = "#20d890";

  } catch (error) {
    message.textContent = error.message;
    message.style.color = "#ff5268";
    userList.textContent = "Unable to load users.";
  }
}

loadAdminData();
