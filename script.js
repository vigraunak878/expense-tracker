const form = document.querySelector("form");
const transactions = document.getElementById("Transactions");
const Balance = document.getElementById("Balance");
const Income = document.getElementById("Income");
const Expense = document.getElementById("Expense");

document.addEventListener("DOMContentLoaded", loadTransactions);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;

  const type = document.getElementById("type").value;

  const amount = parseFloat(document.getElementById("amount").value);

  let transaction = {
    id: Date.now(),
    description,
    type,
    amount,
  };

  addTransactionToDom(transaction);

  saveTransactionToLocalStorage(transaction);

  updateSummary();

  form.reset();
});

function addTransactionToDom(transaction) {
  const parent = document.createElement("div");
  parent.classList.add("transaction-list");

  const des = document.createElement("span");
  des.textContent = transaction.description;
  des.classList.add("description-list");

  const amou = document.createElement("span");
  amou.textContent = "\u20B9" + transaction.amount;
  amou.classList.add("amount-list");

  const typ = document.createElement("span");
  typ.textContent = transaction.type;
  typ.classList.add("type-list");

  if (transaction.type === "income") typ.style.color = "rgb(81, 218, 46)";
  else typ.style.color = "rgb(236, 65, 65)";

  const remove = document.createElement("button");

  remove.innerHTML = `<span>&#10006</span>`;
  remove.classList.add("cross");

  remove.addEventListener("click", (e) => {
    parent.remove();
    deleteFromLocalStorage(transaction.id);
    updateSummary();
  });

  parent.append(des, amou, typ, remove);

  transactions.append(parent);
}

function saveTransactionToLocalStorage(transaction) {
  let data = JSON.parse(localStorage.getItem("transactions")) || [];
  data.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(data));
}

function loadTransactions() {
  let data = JSON.parse(localStorage.getItem("transactions")) || [];
  data.forEach((element) => addTransactionToDom(element));
  updateSummary();
}

function deleteFromLocalStorage(id) {
  let data = JSON.parse(localStorage.getItem("transactions")) || [];
  data = data.filter((item) => item.id !== id);
  localStorage.setItem("transactions", JSON.stringify(data));
}

function updateSummary() {
  let data = JSON.parse(localStorage.getItem("transactions")) || [];

  let income = 0;
  let expense = 0;

  data.forEach((item) => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  let balance = income - expense;

  Balance.textContent = "₹" + balance;
  Income.textContent = "₹" + income;
  Expense.textContent = "₹" + expense;
}
