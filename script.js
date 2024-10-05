const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("transactionList");
const addButton = transactionForm.querySelector("button");
const descriptionInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const formTitle = document.getElementById("titleText");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editTransactionId = null;

function handleTransaction(event) {
    event.preventDefault();
  
    const description = descriptionInput.value;
    const amount = +amountInput.value;  // Corrected unary plus to convert value to a number
    const date = dateInput.value;
  
    if (description.trim() === "" || amount === 0) {
      alert("Please add a valid description and amount");
      return;
    }
  
    if (editTransactionId !== null) {
      // Edit existing transaction
      const transaction = transactions.find((t) => t.id === editTransactionId);
      transaction.description = description;
      transaction.amount = amount;
      transaction.date = date;  // Make sure date is also updated
      editTransactionId = null; // Reset edit mode
    } else {
      // Add new transaction
      const transaction = {
        id: transactions.length + 1,
        date, // Add the date to the new transaction
        description,
        amount: amount,
      };
      transactions.push(transaction);
    }
  
    saveTransactionsToLocalStorage();
    renderTransactions();
    updateBalance();
  
    // Clear input fields
    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";  // Clear date input after transaction
}
function deleteTransaction(id) {
    const confirmation = confirm(
      "Are you sure you want to delete this transaction?"
    );
  
    if (confirmation) {
      transactions = transactions.filter((transaction) => transaction.id !== id);
      saveTransactionsToLocalStorage();
      renderTransactions();
      updateBalance();
    }
  }
  
  // Edit a transaction
  function editTransaction(id) {
    const transaction = transactions.find((t) => t.id === id);
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    dateInput.value = transaction.date;
  
    // Change the button text and form title to indicate edit mode
    addButton.textContent = "Edit Transaction";
    formTitle.textContent = "Edit Transaction";
    editTransactionId = id;
    cancelEditButton.style.display = "inline";
  }
  
  function cancelEdit() {
    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
  
    addButton.textContent = "Add";
    formTitle.textContent = "Add Transaction";
    editTransactionId = null; // Reset the edit mode
  
    cancelEditButton.style.display = "none";
  }
// Render the transactions to the DOM
function renderTransactions() {
    list.innerHTML = "";
    transactions.forEach((transaction) => {
      const li = document.createElement("li");
      li.classList.add(transaction.amount > 0 ? "income" : "expense");
      li.innerHTML = `
              ${transaction.description} 
              <span>
              ${transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount)} Tk.
              <p>${new Date(transaction.date).toLocaleDateString()}</p>  <!-- Use transaction.date -->
              </span>
              
              <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
              <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
          `;
          list.appendChild(li);
    });
}

// Save transactions to localStorage
function saveTransactionsToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update balance, income, and expense totals
function updateBalance() {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const totalBalance = totalIncome - totalExpense;

    income.textContent = `${totalIncome.toFixed(2)} Tk`;
    expense.textContent = `${totalExpense.toFixed(2)} Tk`;
    balance.textContent = `${totalBalance.toFixed(2)} Tk`;
}

// Event Listeners
transactionForm.addEventListener("submit", handleTransaction);
cancelEditButton.addEventListener("click", cancelEdit);

// Initialize
function init() {
    renderTransactions();
    updateBalance();
}

init();
