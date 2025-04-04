document.addEventListener('DOMContentLoaded', function() {
    const workoutName = document.getElementById("workout-name");
    const workoutDate = document.getElementById("workout-date");
    const workoutEntries = document.getElementById("workout-entries");
    const confirmationDialog = document.getElementById("confirmation-dialog");
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    let entryToRemove = null;

    function validateInput(inputId, type, required = false) {
        const input = document.getElementById(inputId);
        const value = input ? input.value : "";
        let isValid = true;

        if (required && !value) {
            isValid = false;
        } else if (type === 'number') {
            if (isNaN(value) || parseFloat(value) < 0) {
                isValid = false;
            }
        } else if (type === 'date' && isNaN(Date.parse(value))) {
            isValid = false;
        }

        if (!isValid && inputId) {
            alert(`Invalid input for ${inputId}.`);
            input.classList.add('invalid-input');
            input.focus();
            return false;
        } else if (inputId) {
            input.classList.remove('invalid-input');
        }
        return isValid;
    }

    function sanitizeInput(input) {
        let sanitized = DOMPurify.sanitize(input);
        return sanitized.replace(/[<>]/g, '');
    }

    document.getElementById("add-entry").addEventListener("click", () => {
        const entry = document.createElement("div");
        entry.classList.add("workout-entry");
        entry.innerHTML = `
            <input type="text" placeholder="Exercise" id="exercise-${Date.now()}">
            <input type="number" placeholder="Set" min="1" id="sets-${Date.now()}">
            <input type="number" placeholder="Reps" min="1" id="reps-${Date.now()}">
            <input type="number" placeholder="Weight" min="0" id="weight-${Date.now()}">
            <input type="text" placeholder="Notes" id="notes-${Date.now()}">
        `;
        workoutEntries.appendChild(entry);
    });

    document.getElementById("remove-entry").addEventListener("click", () => {
        if (workoutEntries.children.length > 1) {
            entryToRemove = workoutEntries.lastChild;
            confirmationDialog.style.display = "block";
        }
    });

    confirmYes.addEventListener("click", () => {
        workoutEntries.removeChild(entryToRemove);
        confirmationDialog.style.display = "none";
        entryToRemove = null;
    });

    confirmNo.addEventListener("click", () => {
        confirmationDialog.style.display = "none";
        entryToRemove = null;
    });

    document.getElementById("save-workout").addEventListener("click", () => {
        if(!validateInput("workout-name", "text", true) ||
            !validateInput("workout-date", "date", true)
        ){
            return;
        }
        const workout = {
            name: sanitizeInput(workoutName.value),
            date: workoutDate.value,
            entries: Array.from(workoutEntries.children)
                .slice(1)
                .map(entry => {
                    const inputs = Array.from(entry.querySelectorAll("input"));
                    if(!validateInput(inputs[0].id || "", "text", true) ||
                        !validateInput(inputs[1].id || "", "number", true) ||
                        !validateInput(inputs[2].id || "", "number", true) ||
                        !validateInput(inputs[3].id || "", "number", true) ||
                        !validateInput(inputs[4].id || "", "text", false)){
                        return null;
                    }
                    return inputs.map(input => sanitizeInput(input.value));
                }).filter(entry => entry !== null)
        };
        if (!workout.name || !workout.date || workout.entries.length === 0) {
            alert("Please complete all fields before saving.");
            return;
        }
        localStorage.setItem("workoutLog", JSON.stringify(workout));
        alert("Workout log saved!");
    });

    document.getElementById("load-workout").addEventListener("click", () => {
        const savedWorkout = localStorage.getItem("workoutLog");
        if (!savedWorkout) return alert("No saved workout log found.");

        const workout = JSON.parse(savedWorkout);
        workoutName.value = workout.name || "";
        workoutDate.value = workout.date || "";

        while (workoutEntries.children.length > 1) {
            workoutEntries.removeChild(workoutEntries.lastChild);
        }

        workout.entries.forEach(entry => {
            document.getElementById("add-entry").click();
            const inputFields = workoutEntries.lastChild.querySelectorAll("input");
            inputFields.forEach((input, index) => (input.value = entry[index] || ""));
        });
    });

   document.getElementById("print-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert("jsPDF library not loaded. PDF generation is unavailable.");
        return;
    }

    const doc = new jsPDF();

    try {
        doc.text("Daily Workout Chart", 10, 10);
        doc.text(`Workout Name: ${workoutName.value || "Unnamed Workout"}`, 10, 20);
        doc.text(`Date: ${workoutDate.value || "No Date"}`, 10, 30);

        let headers = ["Exercise", "Sets", "Reps", "Weight", "Notes"];
        let rows = [];

        Array.from(workoutEntries.children).slice(1).forEach(entry => {
            const inputs = Array.from(entry.querySelectorAll("input")); // Convert NodeList to Array
            let rowData = inputs.map(input => input.value || "N/A");
            rows.push(rowData);
        });

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 40,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fontSize: 8,
                fillColor: [200, 200, 200],
            },
        });

        doc.save("workoutLog.pdf");
        alert("PDF generated successfully with dynamic data!");

    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Please try again.");
    }
});
    document.getElementById("download-workout").addEventListener("click", () => {
        const workout = localStorage.getItem("workoutLog");
        if (!workout) return alert("No workout log to download.");

        const blob = new Blob([workout], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "workoutLog.json";
        a.click();
        URL.revokeObjectURL(a.href);
    });

    document.getElementById("upload-workout").addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const parsedData = JSON.parse(e.target.result);

                if (typeof parsedData !== 'object' || parsedData === null ||
                    !parsedData.hasOwnProperty('name') || !parsedData.hasOwnProperty('date') ||
                    !parsedData.hasOwnProperty('entries') || !Array.isArray(parsedData.entries)) {
                    throw new Error("Invalid workout log structure.");
                }

                for (const entry of parsedData.entries) {
                    if (!Array.isArray(entry) || entry.length !== 5) {
                        throw new Error("Invalid workout entry structure.");
                    }
                }

                localStorage.setItem("workoutLog", JSON.stringify(parsedData));
                document.getElementById("load-workout").click();
                alert("Workout log uploaded!");

            } catch (error) {
                alert("Invalid file uploaded: " + error.message);
            }
        };
        reader.readAsText(file);
    });
});
