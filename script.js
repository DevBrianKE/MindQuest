// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");

    // Function to fetch trivia questions from an API
    async function fetchQuestions() {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy");
            const data = await response.json();
            const question = data.results[0];

            let answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

            questionContainer.innerHTML = `
                <h3>${question.question}</h3>
                <div class="options">
                    ${answers.map(answer => `<button class="option-btn">${answer}</button>`).join('')}
                </div>
            `;

            document.querySelectorAll(".option-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
                    e.target.classList.add("selected");
                });
            });

        } catch (error) {
            questionContainer.innerHTML = `<p>Error loading questions.</p>`;
        }
    }
    fetchQuestions();
});
