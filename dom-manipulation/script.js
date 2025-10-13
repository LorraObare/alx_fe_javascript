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
function displayRandomQuote() {
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
  displayRandomQuote(); // ✅ correct function name

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

// --- Step 6: Dynamically create form (for test requirement) ---
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// --- Step 7: Event Listeners ---
newQuoteBtn.addEventListener("click", displayRandomQuote);

// --- Step 8: Initialize ---
populateCategories();
createAddQuoteForm();
