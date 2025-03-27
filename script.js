document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const startBtn = document.getElementById("start-btn");
    const numQuestionsInput = document.getElementById("num-questions");

    let questionHistory = [];
    let currentIndex = 0;
    let userAnswers = [];

    // Function to fetch questions
    async function fetchQuestions(amount) {
        try {
            if (amount < 1 || amount > 20) {
                alert("Please enter a number between 1 and 20.");
                return;
            }

            const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const data = await response.json();
            if (!data.results || data.results.length === 0) throw new Error("No questions received from API.");

            // Process and shuffle answers
            questionHistory = data.results.map(q => {
                let answers = [...q.incorrect_answers, q.correct_answer];
                answers.sort(() => Math.random() - 0.5);
                return { question: q.question, correct_answer: q.correct_answer, answers };
            });

            currentIndex = 0;
            userAnswers = new Array(amount).fill(null);
            displayQuestion();

            // Show Next and Previous buttons
            nextBtn.style.display = "inline-block";
            prevBtn.style.display = "inline-block";
        } catch (error) {
            console.error("Fetch Error:", error);
            questionContainer.innerHTML = `<p style="color: red;">Error loading questions. Try again.</p>`;
        }
    }

    // Function to display a question
    function displayQuestion() {
        if (currentIndex < questionHistory.length) {
            const { question, answers } = questionHistory[currentIndex];

            questionContainer.innerHTML = `
                <h3>${question}</h3>
                <div class="options">
                    ${answers.map(answer => `<button class="option-btn">${answer}</button>`).join('')}
                </div>
            `;

            // Add event listeners for answer selection
            document.querySelectorAll(".option-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
                    e.target.classList.add("selected");

                    // Store the selected answer
                    userAnswers[currentIndex] = e.target.textContent;
                });
            });

            // Enable/Disable Previous button
            prevBtn.disabled = currentIndex === 0;
        } else {
            showResults();
        }
    }

    // Function to show final results
    function showResults() {
        let correctCount = 0;
        let resultHTML = `<h2>Quiz Results</h2>`;

        questionHistory.forEach((q, i) => {
            let userAnswer = userAnswers[i] || "No answer selected";
            let isCorrect = userAnswer === q.correct_answer;
            if (isCorrect) correctCount++;

            resultHTML += `
                <div class="result-item">
                    <strong>Q${i + 1}: ${q.question}</strong><br>
                    Your Answer: <span class="${isCorrect ? 'correct' : 'wrong'}">${userAnswer}</span><br>
                    Correct Answer: <span class="correct">${q.correct_answer}</span>
                </div>
                <hr>
            `;
        });

        resultHTML = `
            <h2>Your Score: ${correctCount} / ${questionHistory.length}</h2>
            ${resultHTML}
            <button id="restart-btn">Restart Quiz</button>
        `;

        questionContainer.innerHTML = resultHTML;

        document.getElementById("restart-btn").addEventListener("click", () => {
            questionContainer.innerHTML = "";
            nextBtn.style.display = "none";
            prevBtn.style.display = "none";
        });

        nextBtn.style.display = "none";
        prevBtn.style.display = "none";
    }

    // Next button logic
    nextBtn.addEventListener("click", () => {
        if (currentIndex < questionHistory.length - 1) {
            currentIndex++;
            displayQuestion();
        } else {
            showResults();
        }
    });

    // Previous button logic
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayQuestion();
        }
    });

    // Start Quiz Button
    startBtn.addEventListener("click", () => {
        let numQuestions = parseInt(numQuestionsInput.value);
        fetchQuestions(numQuestions);
    });

    // Hide buttons initially
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
});
