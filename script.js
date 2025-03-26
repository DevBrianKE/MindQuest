// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");

    // Function to fetch trivia questions from an API
    async function fetchQuestions() {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy");
            const data = await response.json();
            questionContainer.innerHTML = `<p>First question: ${data.results[0].question}</p>`;
        } catch (error) {
            questionContainer.innerHTML = `<p>Error loading questions.</p>`;
        }
    }

    fetchQuestions();
});
