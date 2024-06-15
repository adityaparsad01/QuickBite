// Function to calculate monthly total expenses, total income, and average
const calculateMonthlyStats = () => {
    const existingData = localStorage.getItem("expenseData");
    if (existingData) {
        const expenseData = JSON.parse(existingData);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        let totalIncome = 0;
        let totalExpenses = 0;
        let entriesCount = 0;
        expenseData.forEach(entry => {
            const entryDate = new Date(entry.date);
            const entryMonth = entryDate.getMonth() + 1;
            if (entryMonth === currentMonth) {
                totalIncome += parseInt(entry.income);
                totalExpenses += parseInt(entry.expenses);
                entriesCount++;
            }
        });
        const average = entriesCount ? ((totalIncome - totalExpenses) / entriesCount).toFixed(2) : 0;
        return { totalIncome, totalExpenses, average };
    }
    return { totalIncome: 0, totalExpenses: 0, average: 0 };
};


// Function to display monthly stats
const displayMonthlyStats = () => {
    const { totalIncome, totalExpenses, average } = calculateMonthlyStats();
    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpenses").textContent = totalExpenses;
    document.getElementById("average").textContent = average;
};

// Function to save data to local storage and clear input fields
const saveData = () => {
    const date = document.getElementById("date").value;
    const income = document.getElementById("income").value;
    const expenses = document.getElementById("expenses").value;

    // Validate input fields
    if (date.trim() === '' || income.trim() === '' || expenses.trim() === '') {
        alert("Please fill in all fields.");
        return;
    }

    const existingData = localStorage.getItem("expenseData");
    const expenseData = existingData ? JSON.parse(existingData) : [];
    console.log(expenseData)

    // Check if an entry for the selected date already exists
    const entryExists = expenseData.some(entry => entry.date === date);

    if (entryExists) {
        alert("An entry for this date already exists.");
        return;
    }

    // If no entry exists for the selected date, save the new entry
    expenseData.push({
        date,
        income,
        expenses
    });
    localStorage.setItem("expenseData", JSON.stringify(expenseData));

    // Clear input fields
    document.getElementById("date").value = "";
    document.getElementById("income").value = "";
    document.getElementById("expenses").value = "";

    displayData();
    displayMonthlyStats();
};

// Function to display saved data
const displayData = () => {
    const existingData = localStorage.getItem("expenseData");

    if (existingData) {
        const expenseData = JSON.parse(existingData);

        // Sort the data by date in descending order
        expenseData.sort((a, b) => new Date(b.date) - new Date(a.date));

        let tableHtml = `<div class='table-container'><table class='table table-hover' width='100%' border='1'><thead><tr class="text-center"><th scope="col">Date</th><th scope="col">Income</th><th scope="col">Expenses</th><th scope="col">Difference</th><th scope="col">Action</th></tr></thead><tbody>`;

        expenseData.forEach((entry, index) => {
            const difference = entry.income - entry.expenses;
            const differenceClass = difference < 0 ? "negative" : "";

            // Format the date to "dd-mm-yy"
            const date = new Date(entry.date);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            const formattedDate = `${day}-${month}-${year}`;

            tableHtml += `<tr><td>${formattedDate}</td><td>${entry.income}</td><td>${entry.expenses}</td><td class='${differenceClass}'>${difference}</td><td><div class="btn-container"><button onclick='editEntry(${index})'><i class="fa-regular fa-pen-to-square"></i></button> <button onclick='deleteEntry(${index})'><i class="fa-regular fa-trash-can"></i></button></div></td></tr>`;
        });

        tableHtml += `</tbody></table></div>`;
        document.getElementById("expenseData").innerHTML = tableHtml;
    } else {
        document.getElementById("expenseData").innerHTML = "No data available";
    }
    displayMonthlyStats();
};

// Function to edit an entry
const editEntry = (index) => {
    const existingData = localStorage.getItem("expenseData");
    const expenseData = JSON.parse(existingData);
    const entry = expenseData[index];

    document.getElementById("date").value = entry.date;
    document.getElementById("income").value = entry.income;
    document.getElementById("expenses").value = entry.expenses;

    expenseData.splice(index, 1);
    localStorage.setItem("expenseData", JSON.stringify(expenseData));

    displayData();
    displayMonthlyStats();
};

// Function to delete an entry
const deleteEntry = (index) => {
    const confirmation = confirm("Are you sure you want to delete this entry?");
    if (confirmation) {
        const existingData = localStorage.getItem("expenseData");
        const expenseData = JSON.parse(existingData);
        expenseData.splice(index, 1);
        localStorage.setItem("expenseData", JSON.stringify(expenseData));
        displayData();
        displayMonthlyStats();
    }
};

// Function to download CSV
const downloadCSV = () => {
    const existingData = localStorage.getItem("expenseData");

    if (existingData) {
        const expenseData = JSON.parse(existingData);
        let csvContent = "data:text/csv;charset=utf-8,Date,Total Income,Total Expenses,Difference\n";
        expenseData.forEach(entry => {
            const difference = entry.income - entry.expenses;
            csvContent += `${entry.date},${entry.income},${entry.expenses},${difference}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expenseData.csv");
        document.body.appendChild(link);
        link.click();
    } else {
        alert("No data available to download.");
    }
};

// Display saved data when the page loads
window.onload = () => {
    displayData();
};