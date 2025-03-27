document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");

    let questionHistory = [];
    let currentIndex = -1;

    // Function to fetch a new trivia question
    async function fetchQuestion() {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=5");

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                throw new Error("No questions received from API.");
            }

            const question = data.results[0];

            if (!question.question || !question.correct_answer || !question.incorrect_answers) {
                throw new Error("Invalid question format received.");
            }

            let answers = [...question.incorrect_answers, question.correct_answer];
            answers.sort(() => Math.random() - 0.5);

            questionHistory.push({ question, answers });
            currentIndex++;

            displayQuestion();
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }

    // Function to display a question
    function displayQuestion() {
        if (currentIndex >= 0 && currentIndex < questionHistory.length) {
            const { question, answers } = questionHistory[currentIndex];

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

            prevBtn.disabled = currentIndex === 0; 
        }
    }

    // Next button logic
    nextBtn.addEventListener("click", () => {
        if (currentIndex < questionHistory.length - 1) {
            currentIndex++;
            displayQuestion();
        } else {
            fetchQuestion();
        }
    });

    // Previous button logic
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayQuestion();
        }
    });

    // Fetch first question on page load
    fetchQuestion();
});
