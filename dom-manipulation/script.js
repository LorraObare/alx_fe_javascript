// --- Step 1: Define our initial data structure ---
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Faith does not make things easy, it makes them possible.", category: "Faith" },
  { text: "Do not be afraid; keep on speaking, do not be silent.", category: "Faith" },
  { text: "Experience is the name everyone gives to their mistakes.", category: "Wisdom" },
];

// --- Step 2: Grab key DOM elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

// --- Step 3: Populate category dropdown dynamically ---
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories
  categorySelect.innerHTML = ""; // clear dropdown first

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// --- Step 4: Display a random quote ---
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// --- Step 5: Add a new quote dynamically ---
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both fields!");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  populateCategories();
  showRandomQuote(); // ✅ correct function name

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}


// --- Step 6: Event Listeners ---
newQuoteBtn.addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// --- Step 7: Initialize ---
populateCategories();


//Storing Data
localStorage.setItem("quotes", JSON.stringify(quotes));

//Retrieving Data
const storedQuotes = JSON.parse(localStorage.getItem("quotes"));
if (storedQuotes) {
  quotes.push(...storedQuotes);
}

// 1️⃣ Add new quote to array
  quotes.push({ text: newText, category: newCategory });

  // 2️⃣ Save updated array to localStorage (persistent storage)
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // 3️⃣ Update dropdown and show confirmation
  populateCategories();
  quoteDisplay.textContent = `New quote added to category: ${newCategory}`;
  
  // 4️⃣ Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";


// --- Step 6: Load quotes from localStorage if available ---
window.onload = function() {
  const savedQuotes = JSON.parse(localStorage.getItem("quotes"));
  if (savedQuotes && savedQuotes.length > 0) {
    quotes = savedQuotes;
  }
  populateCategories();
};

// --- Step 7: Event Listener for “Show New Quote” ---
newQuoteBtn.addEventListener("click", showRandomQuote);