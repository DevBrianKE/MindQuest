// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const nextBtn = document.getElementById("next-btn") //Selecet "Next" button

    // Function to fetch trivia questions from an API
    async function fetchQuestions() {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy");
            const data = await response.json();
            const question = data.results[0];

            let answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

            // Display the new question and answer choices
            questionContainer.innerHTML = `
                <h3>${question.question}</h3>
                <div class="options">
                    ${answers.map(answer => `<button class="option-btn">${answer}</button>`).join('')}
                </div>
            `;

             // Add event listeners for selecting an answer
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

    // Event listener to fetch a new question when "Next" button is clicked
    nextBtn.addEventListener("click", fetchQuestions);
});
