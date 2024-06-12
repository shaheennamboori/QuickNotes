document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("note-form");
  const input = document.getElementById("note-input");
  const list = document.getElementById("note-list");

  function renderNotes(notes) {
    list.innerHTML = "";
    notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.textContent = note;

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      const deleteButton = document.createElement("button");
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = '&#x1F5D1;'; // Unicode trash can icon
      deleteButton.addEventListener("click", () => {
        deleteNote(index);
      });
      
      const copyButton = document.createElement("button");
      copyButton.classList.add('copy-button');
      copyButton.innerHTML = '&#x1F4CB;'; // Unicode clipboard icon
      copyButton.addEventListener("click", () => {
        copyToClipboard(note);
      });

      buttonContainer.appendChild(copyButton);
      buttonContainer.appendChild(deleteButton);
      li.appendChild(buttonContainer);

      list.appendChild(li);
    });
  }

  function loadQuickNotes() {
    chrome.storage.sync.get(["notes"], function (result) {
      const notes = result.notes || [];
      renderNotes(notes);
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard:", text); // Debugging line
      })
      .catch((err) => {
        console.error("Failed to copy:", err); // Debugging line
      });
  }

  function addNote(note) {
    chrome.storage.sync.get(["notes"], function (result) {
      const notes = result.notes || [];
      notes.push(note);
      chrome.storage.sync.set({ notes }, function () {
        renderNotes(notes);
      });
    });
  }

  function deleteNote(index) {
    chrome.storage.sync.get(["notes"], function (result) {
      const notes = result.notes || [];
      notes.splice(index, 1);
      chrome.storage.sync.set({ notes }, function () {
        renderNotes(notes);
      });
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newNote = input.value;
    addNote(newNote);
    input.value = "";
  });

  loadQuickNotes();
});
