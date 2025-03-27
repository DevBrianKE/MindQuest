document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");

    let questionHistory = [];
    let currentIndex = 0;
    let userAnswers = [];

    // Function to fetch multiple questions
    async function fetchQuestions(amount = 5) {
        try {
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

            displayQuestion();
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
        let resultHTML = `<h2>Final Summary</h2>`;
        resultHTML += `<ul>`;
        
        questionHistory.forEach((q, i) => {
            let userAnswer = userAnswers[i] || "No answer selected";
            let isCorrect = userAnswer === q.correct_answer;
            resultHTML += `
                <li>
                    <strong>Q${i + 1}: ${q.question}</strong><br>
                    Your Answer: <span style="color: ${isCorrect ? 'green' : 'red'};">${userAnswer}</span><br>
                    Correct Answer: <span style="color: green;">${q.correct_answer}</span>
                </li><br>
            `;
        });

        resultHTML += `</ul><button id="restart-btn">Restart Quiz</button>`;
        questionContainer.innerHTML = resultHTML;

        document.getElementById("restart-btn").addEventListener("click", () => {
            currentIndex = 0;
            userAnswers = [];
            fetchQuestions();
        });

        nextBtn.style.display = "none";
        prevBtn.style.display = "none";
    }

    // Next button logic
    nextBtn.addEventListener("click", () => {
        if (currentIndex < questionHistory.length) {
            currentIndex++;
            displayQuestion();
        }
    });

    // Previous button logic
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayQuestion();
        }
    });

    // Fetch questions on page load
    fetchQuestions(20);
});
