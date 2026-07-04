const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const app = document.getElementById("app");

const loginBtn = document.getElementById("loginBtn");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const registerBtn = document.getElementById("registerBtn");
const registerUsername = document.getElementById("registerUsername");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const gotoRegister = document.getElementById("gotoRegister");
const gotoLogin = document.getElementById("gotoLogin");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionCount = document.getElementById("transactionCount");
const resetChart = document.querySelector(".resetChart-btn");

const transactionTable = document.getElementById("transactionTable");
const searchTransaction = document.getElementById("searchTransaction");
const filterType = document.getElementById("filterType");

const modal = document.getElementById("transactionModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const transactionForm = document.getElementById("transactionForm");

const transactionType = document.getElementById("transactionType");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");

const displayName = document.getElementById("displayName");
const currencySelect = document.getElementById("currencySelect");
const darkModeToggle = document.getElementById("darkModeToggle");
const saveProfile = document.getElementById("saveProfile");
const resetData = document.getElementById("resetData");
const logoutBtn = document.getElementById("logoutBtn");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const STORAGE = {
  USERS: "fintrack_users",
  TRANSACTIONS: "fintrack_transactions",
  SETTINGS: "fintrack_settings",
};

let transactions = [];

let editingId = null;

let chart = null;

let currentCurrency = "₹";

let currentUser = null;

let settings = {
  currency: "₹",

  darkMode: false,

  displayName: "User",
};

window.addEventListener("DOMContentLoaded", init);

function init() {
  loadSettings();

  loadTransactions();

  setupNavigation();

  setupModal();

  setupTheme();

  updateDashboard();
}

function generateId() {
  return Date.now().toString();
}

function formatCurrency(value) {
  return `${settings.currency}${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function showToast(message) {
  toastMessage.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function saveTransactions() {
  localStorage.setItem(
    STORAGE.TRANSACTIONS,

    JSON.stringify(transactions),
  );
}

function loadTransactions() {
  transactions = JSON.parse(localStorage.getItem(STORAGE.TRANSACTIONS)) || [];
}

function saveSettings() {
  localStorage.setItem(
    STORAGE.SETTINGS,

    JSON.stringify(settings),
  );
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.SETTINGS));

  if (saved) {
    settings = saved;
  }

  currentCurrency = settings.currency;
}

gotoRegister.addEventListener("click", () => {
  loginPage.classList.add("hidden");
  registerPage.classList.remove("hidden");
});

gotoLogin.addEventListener("click", () => {
  loginPage.classList.remove("hidden");
  registerPage.classList.add("hidden");
});

registerBtn.addEventListener("click", registerUser);

function registerUser() {
  const username = registerUsername.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password should contain at least 6 characters");
    return;
  }

  let users = JSON.parse(localStorage.getItem(STORAGE.USERS)) || [];

  const usernameExists = users.some((user) => user.username === username);

  if (usernameExists) {
    alert("Username already exists");
    return;
  }

  const emailExists = users.some((user) => user.email === email);

  if (emailExists) {
    alert("Email already registered");
    return;
  }

  const user = {
    id: generateId(),
    username,
    email,
    password,
  };

  users.push(user);

  localStorage.setItem(STORAGE.USERS, JSON.stringify(users));

  alert("Registration Successful");

  clearRegisterForm();

  registerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
}

loginBtn.addEventListener("click", loginUser);

function loginUser() {
  const username = loginUsername.value.trim();

  const password = loginPassword.value.trim();

  if (!username || !password) {
    alert("Enter username & password");
    return;
  }
  const users = JSON.parse(localStorage.getItem(STORAGE.USERS)) || [];
  
  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!user) {
    alert("Invalid Username or Password");
    return;
  }

  currentUser = user;

  settings.displayName = user.username;

  showApp();
}

function showApp() {
  loginPage.classList.remove("active");
  loginPage.classList.add("hidden");

  registerPage.classList.add("hidden");

  app.classList.remove("hidden");

  displayName.value = settings.displayName;

  document.getElementById("profileName").textContent = settings.displayName;

  updateDashboard();
}

logoutBtn.addEventListener("click", logout);

function logout() {
  app.classList.add("hidden");

  registerPage.classList.remove("active");

  loginPage.classList.remove("hidden");

  loginUsername.value = "";

  loginPassword.value = "";

  alert("Logged Out");
}

saveProfile.addEventListener("click", () => {
  settings.displayName = displayName.value.trim() || "User";

  saveSettings();

  document.getElementById("profileName").textContent = settings.displayName;

  showToast("Profile Updated");
});

document

  .querySelectorAll(".password-toggle")

  .forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");

      const icon = btn.querySelector("i");

      if (input.type === "password") {
        input.type = "text";

        icon.className = "fa-regular fa-eye-slash";
      } else {
        input.type = "password";

        icon.className = "fa-regular fa-eye";
      }
    });
  });

function clearRegisterForm() {
  registerUsername.value = "";

  registerEmail.value = "";

  registerPassword.value = "";
}

function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-item");

  const pages = document.querySelectorAll(".content-page");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      pages.forEach((page) => page.classList.remove("active-page"));

      document

        .getElementById(button.dataset.page)

        .classList.add("active-page");
    });
  });
}

function setupModal() {
  openModal.addEventListener("click", openTransactionModal);

  closeModal.addEventListener("click", closeTransactionModal);

  cancelModal.addEventListener("click", closeTransactionModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeTransactionModal();
    }
  });
}

function openTransactionModal() {
  editingId = null;

  transactionForm.reset();

  document.getElementById("modalTitle").textContent = "Add Transaction";

  modal.classList.add("active");
}

function closeTransactionModal() {
  modal.classList.remove("active");

  transactionForm.reset();

  editingId = null;
}

transactionForm.addEventListener("submit", saveTransaction);

function saveTransaction(e) {
  e.preventDefault();

  const type = transactionType.value;

  const desc = description.value.trim();

  const amt = Number(amount.value);

  const transDate = date.value;

  const cat = category.value;

  if (!type || !desc || !amt || !transDate || !cat) {
    showToast("Please complete all fields");

    return;
  }

  const transaction = {
    id: editingId || generateId(),

    type,

    description: desc,

    amount: amt,

    date: transDate,

    category: cat,
  };

  if (editingId) {
    const index = transactions.findIndex((item) => item.id === editingId);

    transactions[index] = transaction;

    showToast("Transaction Updated");
  } else {
    transactions.push(transaction);

    showToast("Transaction Added");
  }

  saveTransactions();

  updateDashboard();

  renderTransactions();

  renderChart();

  closeTransactionModal();
}

function editTransaction(id) {
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) return;

  editingId = id;

  document.getElementById("modalTitle").textContent = "Edit Transaction";

  transactionType.value = transaction.type;

  description.value = transaction.description;

  amount.value = transaction.amount;

  date.value = transaction.date;

  category.value = transaction.category;

  modal.classList.add("active");
}

function deleteTransaction(id) {
  const confirmDelete = confirm("Delete this transaction?");

  if (!confirmDelete) return;

  transactions = transactions.filter((item) => item.id !== id);

  saveTransactions();

  updateDashboard();

  renderTransactions();

  renderChart();

  showToast("Transaction Deleted");
}

resetData.addEventListener("click", () => {
  const ok = confirm("Delete ALL transactions?");

  if (!ok) return;

  transactions = [];

  saveTransactions();

  updateDashboard();

  renderTransactions();

  renderChart();

  showToast("All Data Deleted");
});

function renderTransactions() {
  transactionTable.innerHTML = "";

  if (transactions.length === 0) {
    transactionTable.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fa-solid fa-wallet"></i>
                        <h3>No Transactions Yet</h3>
                        <p>
                            Click Add Transaction to begin.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  transactions.forEach((item) => {
    transactionTable.innerHTML += `

        <tr>
            <td>${formatDate(item.date)}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td>
                <span class="badge badge-${item.type}">
                    ${item.type}
                </span>
            </td>
            <td class="amount-${item.type}">
                ${formatCurrency(item.amount)}
            </td>
            <td>
                <div class="action-buttons">
                    <button
                        class="edit-btn"
                        onclick="editTransaction('${item.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction('${item.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
        `;
  });
}

function updateDashboard() {
  updateCards();
  renderTransactions();
  renderChart();
}

function updateCards() {
  let totalIncome = 0;
  let totalExpense = 0;

  let highest = 0;

  let today = 0;

  const todayDate = new Date().toISOString().split("T")[0];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  let monthlyExpense = 0;

  transactions.forEach((item) => {
    if (item.type === "income") {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;

      highest = Math.max(highest, item.amount);
    }

    if (item.type === "expense" && item.date === todayDate) {
      today += item.amount;
    }

    const transactionDate = new Date(item.date);

    if (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear &&
      item.type === "expense"
    ) {
      monthlyExpense += item.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  balance.textContent = formatCurrency(totalBalance);

  income.textContent = formatCurrency(totalIncome);

  expense.textContent = formatCurrency(totalExpense);

  transactionCount.textContent = transactions.length;
}

function renderChart() {
  const canvas = document.getElementById("cashFlowChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) {
    chart.destroy();
  }

  const labels = [];

  const incomeData = [];

  const expenseData = [];

  const sorted = [...transactions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  sorted.forEach((item) => {
    labels.push(formatDate(item.date));

    if (item.type === "income") {
      incomeData.push(item.amount);

      expenseData.push(0);
    } else {
      incomeData.push(0);

      expenseData.push(item.amount);
    }
  });

  chart = new Chart(ctx, {
    type: "bar",

    data: {
      labels,

      datasets: [
        {
          label: "Income",

          data: incomeData,

          backgroundColor: "#22C55E",

          borderRadius: 8,
        },

        {
          label: "Expense",

          data: expenseData,

          backgroundColor: "#EF4444",

          borderRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        mode: "index",

        intersect: false,
      },

      plugins: {
        legend: {
          position: "top",
        },
      },

      animation: {
        duration: 1000,
      },

      scales: {
        x: {
          grid: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            callback(value) {
              return settings.currency + value;
            },
          },
        },
      },
    },
  });
}

const chartFilter = document.getElementById("chartFilter");

if (chartFilter) {
  chartFilter.addEventListener("change", () => {
    renderChart();
  });
}

function setupTheme() {
  darkModeToggle.checked = settings.darkMode;

  if (settings.darkMode) {
    document.body.classList.add("dark");
  }

  darkModeToggle.addEventListener("change", () => {
    settings.darkMode = darkModeToggle.checked;

    document.body.classList.toggle("dark");

    saveSettings();

    showToast("Theme Updated");
  });
}

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    console.log("theme is clicked");

    darkModeToggle.checked = !darkModeToggle.checked;

    darkModeToggle.dispatchEvent(new Event("change"));
  });
}

currencySelect.value = settings.currency;

currencySelect.addEventListener("change", () => {
  settings.currency = currencySelect.value;

  saveSettings();

  updateDashboard();

  showToast("Currency Updated");
});

function getIncome() {
  return transactions

    .filter((t) => t.type === "income")

    .reduce(
      (a, b) => a + b.amount,

      0,
    );
}

function getExpense() {
  return transactions

    .filter((t) => t.type === "expense")

    .reduce(
      (a, b) => a + b.amount,

      0,
    );
}

function sortByDate() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function clearTransactionForm() {
  transactionType.value = "income";

  description.value = "";

  amount.value = "";

  category.value = "";

  date.value = new Date()

    .toISOString()

    .split("T")[0];
}

window.editTransaction = editTransaction;

window.deleteTransaction = deleteTransaction;

sortByDate();

updateDashboard();
