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

// --- Export quotes to JSON file ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  // Free up memory
  URL.revokeObjectURL(url);
}

// --- Step 6: Import quotes from JSON file ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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

// --- Populate Categories Dropdown ---
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Clear dropdown
  categoryFilter.innerHTML = "";

  // Populate categories
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  categoryFilter.value = lastSelectedCategory;
}

// --- Filter Quotes Based on Category ---
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  lastSelectedCategory = selectedCategory;

  const quoteDisplay = document.getElementById("quoteDisplay");
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // Show filtered quotes
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for <em>${selectedCategory}</em>.</p>`;
  } else {
    quoteDisplay.innerHTML = filteredQuotes
      .map(q => `<p>"${q.text}" <em>(${q.category})</em></p>`)
      .join("");
  }
}
 
// --- Step 1: Simulate Server Fetch ---
async function fetchServerQuotes() {
  // Mock API (pretend endpoint)
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
  const data = await response.json();

  // Convert mock data to quote objects
  return data.map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// --- Step 2: Sync with Server ---
async function syncWithServer() {
  const status = document.getElementById("syncStatus");
  status.style.color = "blue";
  status.textContent = "Syncing with server...";

  try {
    const serverQuotes = await fetchServerQuotes();
    const merged = resolveConflicts(quotes, serverQuotes);
    quotes = merged;
    saveQuotes();
    populateCategories();
    filterQuotes();
    status.style.color = "green";
    status.textContent = "✅ Sync complete (server data merged)";
  } catch (err) {
    status.style.color = "red";
    status.textContent = "❌ Sync failed. Try again later.";
  }
}

// --- Step 3: Conflict Resolution ---
function resolveConflicts(localQuotes, serverQuotes) {
  const combined = [...localQuotes];
  let conflicts = 0;

  serverQuotes.forEach(serverQ => {
    const match = localQuotes.find(localQ => localQ.text === serverQ.text);
    if (!match) {
      combined.push(serverQ); // new server quote
    } else if (match.category !== serverQ.category) {
      conflicts++;
      // Strategy: Server data takes precedence
      match.category = serverQ.category;
    }
  });

  if (conflicts > 0) {
    alert(`⚠️ ${conflicts} conflicts found. Server data took precedence.`);
  }

  return combined;
}

// --- Periodic Auto-Sync (every 60 seconds) ---
setInterval(syncWithServer, 60000);

// --- Initialize on Load ---
window.onload = () => {
  populateCategories();
  filterQuotes();
};