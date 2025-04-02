# Ultimate Workout Log

This is a simple web application for logging your workouts. It allows you to:

* Add workout details like name, date, and exercise entries.
* Save your workout logs to local storage.
* Load saved workout logs.
* Print workout logs as PDFs.
* Download workout logs as JSON files.
* Upload workout logs from JSON files.

## Features

* **Add/Remove Exercises:** Easily add or remove exercise entries from your workout log.
* **Save/Load Logs:** Save your workout logs to your browser's local storage and load them later.
* **PDF Generation:** Generate a PDF version of your workout log for easy printing or sharing.
* **JSON Import/Export:** Download your workout logs as JSON files and upload them later.
* **Input Validation:** Ensures that all required fields are filled and that the data is in the correct format.
* **Data Sanitization:** Uses DOMPurify to prevent XSS vulnerabilities.

## How to Use

1.  **Enter Workout Details:** Fill in the workout name and date.
2.  **Add Exercises:** Click the "Add Exercise" button to add exercise entries.
3.  **Fill in Exercise Details:** Enter the exercise name, sets, reps, weight, and notes for each exercise.
4.  **Save the Log:** Click the "Save Log" button to save your workout log to local storage.
5.  **Load a Log:** Click the "Load Log" button to load a previously saved workout log.
6.  **Print as PDF:** Click the "Print as PDF" button to generate a PDF version of your log.
7.  **Download as JSON:** Click the "Download Workout" button to download your log as a JSON file.
8.  **Upload JSON:** Click the "Upload Workout" button to upload a JSON workout file.
9.  **Remove an Exercise:** Click the "Remove Exercise" button to remove the last exercise entry.

## Technologies Used

* HTML
* CSS
* JavaScript
* jsPDF (for PDF generation)
* DOMPurify (for input sanitization)

## Installation

1.  Clone the repository to your local machine.
2.  Open the `index.html` file in your web browser.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
