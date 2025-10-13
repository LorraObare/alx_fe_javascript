// --- Step 1: Define our initial data structure ---
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Faith does not make things easy, it makes them possible.", category: "Faith" },
  { text: "Do not be afraid; keep on speaking, do not be silent.", category: "Faith" },
  { text: "Experience is the name everyone gives to their mistakes.", category: "Wisdom" },
];

// --- Step 2: Grab our key DOM elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteBtn = document.getElementById("addQuoteBtn");

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

// --- Step 4: Show a random quote from selected category ---
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — (${selectedCategory})`;
}

// --- Step 5: Add new quote dynamically ---
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both fields!");
    return;
  }

  // Add the new quote to the array
  quotes.push({ text: newText, category: newCategory });

  // Re-populate categories
  populateCategories();

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// --- Step 6: Event Listeners ---
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// --- Step 7: Initialize ---
populateCategories();
