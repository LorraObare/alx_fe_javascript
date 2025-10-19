// --- Step 1: Define our initial data structure ---
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
  { text: "Faith does not make things easy, it makes them possible.", category: "Faith" },
  { text: "Do not be afraid; keep on speaking, do not be silent.", category: "Faith" },
  { text: "Experience is the name everyone gives to their mistakes.", category: "Wisdom" },
];

let lastSelectedCategory = "all";

// --- Load quotes from localStorage on startup ---
function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// --- Save quotes to localStorage ---
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- Step 2: Grab key DOM elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// --- Step 3: Populate category dropdown dynamically ---
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });
  
  categoryFilter.value = lastSelectedCategory;
}

// --- Step 4: Display a random quote ---
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all" 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// --- Step 5: Filter Quotes Based on Category ---
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  lastSelectedCategory = selectedCategory;
  showRandomQuote();
}

// --- Step 6: Add a new quote dynamically ---
async function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both fields!");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  
  // Save to localStorage
  saveQuotes();
  
  // Post to server
  await postQuoteToServer(newQuote);
  
  populateCategories();
  quoteDisplay.textContent = `New quote added to category: ${newCategory}`;

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// --- Post new quote to mock server ---
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }

    const data = await response.json();
    console.log("Quote posted to server:", data);
    return data;
  } catch (err) {
    console.error(err);
    alert("Error posting quote to server");
  }
}

// --- Fetch quotes from server ---
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
  const data = await response.json();

  return data.map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// --- Sync with Server ---
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const resolved = resolveConflicts(quotes, serverQuotes);
  quotes = resolved;
  
  // Save updated quotes to localStorage
  saveQuotes();
  
  populateCategories();
  showRandomQuote();
  // Notify user about successful sync
  alert("Quotes synced with server!");
}

// --- Conflict Resolution ---
function resolveConflicts(localQuotes, serverQuotes) {
  const combined = [...localQuotes];
  let conflicts = 0;

  serverQuotes.forEach(serverQ => {
    const match = localQuotes.find(localQ => localQ.text === serverQ.text);
    if (!match) {
      combined.push(serverQ);
    } else if (match.category !== serverQ.category) {
      conflicts++;
      match.category = serverQ.category;
    }
  });

  if (conflicts > 0) {
    alert(`⚠️ ${conflicts} conflicts found. Server data took precedence.`);
  }

  return combined;
}

// --- Export quotes to JSON file ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// --- Import quotes from JSON file ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expected an array of quotes.");
      }
    } catch (err) {
      alert("Error reading JSON file. Please check the file format.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Event Listeners ---
newQuoteBtn.addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);

// --- Periodic Auto-Sync (every 60 seconds) ---
setInterval(syncQuotes, 60000);

// --- Initialize ---
loadQuotes();
populateCategories();
showRandomQuote();