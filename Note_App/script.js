const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

// --- NEW FEATURE: Unified Save Function ---
// Save function now stores an array of note objects: [{title: 't1', content: 'c1'}, ...]
const saveNotes = () => {
    // Select all note divs
    const noteElements = document.querySelectorAll(".note");
    const notesData = [];

    noteElements.forEach(note => {
        const title = note.querySelector(".title").value.trim();
        const content = note.querySelector(".content").value.trim();
        
        // Only save notes that have a title OR content
        if (title !== "" || content !== "") {
            notesData.push({ title, content });
        }
    });

    // Save the single, unified data array to local storage
    localStorage.setItem("notesData", JSON.stringify(notesData));
    
    // Optional: Visual feedback
    // console.log("Notes Saved!");
};


// --- Core Function: Create a New Note Card ---
const addNote = (content = "", title = "") => {
    const note = document.createElement("div");
    note.classList.add("note");
    note.innerHTML = `
    <div class="icons">
        <i class="save fas fa-save" title="Save Note (Manual)"></i>
        <i class="trash fas fa-trash" title="Delete Note"></i> 
    </div>
    <div class="title-div">
        <textarea class="title" 
            placeholder="Title (Optional)...">${title}</textarea>
    </div>
    <textarea class="content" 
        placeholder="Write your thoughts here...">${content}</textarea>
    `;

    // --- Event Listeners for the New Note ---
    
    // 1. Delete Button
    const delBtn = note.querySelector(".trash");
    delBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this note?")) {
            note.remove();
            saveNotes(); // Update local storage after deletion
        }
    });
    
    // 2. Save Button (Manual Save)
    const saveButton = note.querySelector(".save");
    saveButton.addEventListener("click", saveNotes);
    
    // 3. --- NEW FEATURE: Auto-Save on Input ---
    // Save note every time a key is released in the title or content area
    const titleArea = note.querySelector(".title");
    const contentArea = note.querySelector(".content");

    titleArea.addEventListener("keyup", saveNotes);
    contentArea.addEventListener("keyup", saveNotes);

    // 4. Append to the main container
    main.appendChild(note);
    contentArea.focus(); // Focus on the content for immediate typing
};

// --- Initial Load Function ---
function loadNotes() {
    // Retrieve the unified data array
    const notesData = JSON.parse(localStorage.getItem("notesData"));
    
    if (notesData) {
        notesData.forEach(item => {
            // Check for valid data before adding
            addNote(item.content || "", item.title || ""); 
        });
    } else {
        // --- NEW FEATURE: Add an initial empty note if storage is empty ---
        addNote(); 
    }
}

// --- Global Event Listeners ---
addBtn.addEventListener("click", addNote);

// --- NEW FEATURE: Keyboard Shortcut ---
document.addEventListener('keydown', (e) => {
    // Check for Ctrl/Cmd + E
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault(); // Prevent default browser behavior (e.g., in some editors)
        addNote();
    }
});

// Load notes when the page starts
loadNotes();