// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const nextBtn = document.getElementById("next-btn");  // Select "Next" button
    const prevBtn = document.getElementById("prev-btn");  // Select "Previous" button

    let questionHistory = []; // Stores previous questions
    let currentIndex = -1;    // Tracks current question index

    // Function to fetch trivia questions from an API
    async function fetchQuestions() {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=1&difficulty=easy");
            const data = await response.json();
            const question = data.results[0];

            let answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

            // Store the current question
            questionHistory.push({ question, answers });
            currentIndex++;

            // Update UI with new question
            displayQuestion();

            // Enable previous button if there is a previous question
            prevBtn.disabled = currentIndex === 0;
        } catch (error) {
            questionContainer.innerHTML = `<p>Error loading question. Please try again.</p>`;
        }
    }

    // Function to display a question
    function displayQuestion() {
        const { question, answers } = questionHistory[currentIndex];

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
    }

    // Event listener to fetch a new question when "Next" button is clicked
    nextBtn.addEventListener("click", fetchQuestions);

    // Event listener to go back to the previous question
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayQuestion();
            prevBtn.disabled = currentIndex === 0;
        }
    });

    // Load the first question
    fetchQuestions();
});
