// (The script.js content is identical to the previous response)
const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

const saveNotes = () => {
    const noteElements = document.querySelectorAll(".note");
    const notesData = [];

    noteElements.forEach(note => {
        const title = note.querySelector(".title").value.trim();
        const content = note.querySelector(".content").value.trim();
        
        if (title !== "" || content !== "") {
            notesData.push({ title, content });
        }
    });

    localStorage.setItem("notesData", JSON.stringify(notesData));
};

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

    const delBtn = note.querySelector(".trash");
    delBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this note?")) {
            note.remove();
            saveNotes(); 
        }
    });
    
    const saveButton = note.querySelector(".save");
    saveButton.addEventListener("click", saveNotes);
    
    const titleArea = note.querySelector(".title");
    const contentArea = note.querySelector(".content");

    titleArea.addEventListener("keyup", saveNotes);
    contentArea.addEventListener("keyup", saveNotes);

    main.appendChild(note);
    contentArea.focus(); 
};

function loadNotes() {
    const notesData = JSON.parse(localStorage.getItem("notesData"));
    
    if (notesData && notesData.length > 0) {
        notesData.forEach(item => {
            addNote(item.content || "", item.title || ""); 
        });
    } else {
        addNote(); // Add an initial empty note if storage is empty
    }
}

addBtn.addEventListener("click", addNote);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault(); 
        addNote();
    }
});

loadNotes();