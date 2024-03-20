// Initialization of global variables
let expenseChart;
const expenseData = {};

// Event listener for form submission
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;

    addExpenseToList(expenseName, expenseAmount, expenseDate);
    updateTotal(expenseAmount);
    updateExpenseData(expenseDate, expenseAmount);
    updateMonthlyTotal();
    updateGraph();

    // Reset form fields
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = '';
});

function addExpenseToList(name, amount, monthYear) {
    const li = document.createElement('li');
    li.innerHTML = `${name} - ${amount.toFixed(2)} Rs <button class="delete-btn" data-amount="${amount}" data-month="${monthYear}">X</button>`;

    li.querySelector('.delete-btn').addEventListener('click', function() {
        const amount = parseFloat(this.getAttribute('data-amount'));
        const monthYear = this.getAttribute('data-month');
        li.remove();
        updateTotal(-amount);
        updateExpenseData(monthYear, -amount);
        updateMonthlyTotal();
        updateGraph();
    });

    document.getElementById('expense-list').appendChild(li);
}

function updateTotal(amount) {
    const total = parseFloat(document.getElementById('total-amount').textContent) + amount;
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

function updateExpenseData(monthYear, amount) {
    if (!expenseData[monthYear]) {
        expenseData[monthYear] = 0;
    }
    expenseData[monthYear] += amount;
}

function updateMonthlyTotal() {
    const totalMonthly = Object.values(expenseData).reduce((acc, curr) => acc + curr, 0);
    document.getElementById('total-monthly').textContent = totalMonthly.toFixed(2);
}


function updateGraph() {
    const canvas = document.getElementById('expenseChart');
    const ctx = canvas.getContext('2d');
    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);

    // Set canvas dimensions based on screen size
    canvas.width = window.innerWidth * 0.7; // 90% of window width
    canvas.height = window.innerHeight * 0.2; // 60% of window height

    if (expenseChart) {
        // Update the existing chart if it's already been created
        expenseChart.data.labels = labels;
        expenseChart.data.datasets[0].data = data;
        expenseChart.update();
    } else {
        // Create a new line chart if it doesn't exist yet
        expenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expenses per Month',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: true,
                }]
            },
            options: {
                responsive: true, // Enable chart responsiveness
                maintainAspectRatio: false, // Disable aspect ratio to fit perfectly
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const expenseDateInput = document.getElementById('expense-date');
    const datepicker = new Datepicker(expenseDateInput, {
        autohide: true,
        format: 'yyyy-mm-dd' // Set the desired date format
    });

    // Initialize the first tab on document load
    document.querySelector('.tab-button').click();
    updateGraph(); // Initial graph setup
});

// Function to toggle visibility of container based on active tab
function showTab(event, tabName) {
    var i, tabContent, tabButtons;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";

    // Toggle visibility of container
    var container = document.getElementById("expense-container");
    if (tabName === "Expenses") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
    var datepicker = document.querySelector('.datepicker');
    if (datepicker) {
        datepicker.style.display = "block";
    }
}
