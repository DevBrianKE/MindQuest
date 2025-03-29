document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const numQuestionsInput = document.getElementById("num-questions");
    const questionContainer = document.getElementById("question-container");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const leaderboardList = document.getElementById("leaderboard");
    const usernameInput = document.getElementById("username");

    let questionHistory = [];
    let currentIndex = 0;
    let userAnswers = [];
    let currentUser = "";

    function decodeHTMLEntities(text) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }

    async function fetchQuestions(amount) {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const data = await response.json();
            questionHistory = data.results.map(q => {
                let answers = [...q.incorrect_answers, q.correct_answer];
                answers.sort(() => Math.random() - 0.5);
                return { 
                    question: decodeHTMLEntities(q.question), 
                    correct_answer: decodeHTMLEntities(q.correct_answer), 
                    answers: answers.map(decodeHTMLEntities)
                };
            });

            currentIndex = 0;
            userAnswers = new Array(amount).fill(null);
            displayQuestion();
        } catch (error) {
            console.error("Fetch Error:", error);
            questionContainer.innerHTML = `<p style="color: red;">Error loading questions. Try again.</p>`;
        }
    }

    function displayQuestion() {
        if (currentIndex < questionHistory.length) {
            const { question, answers } = questionHistory[currentIndex];

            questionContainer.innerHTML = `
                <h3>${question}</h3>
                <div class="options">
                    ${answers.map(answer => `<button class="option-btn">${answer}</button>`).join('')}
                </div>
            `;

            document.querySelectorAll(".option-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
                    e.target.classList.add("selected");
                    userAnswers[currentIndex] = e.target.textContent;
                });
            });
        } else {
            showResults();
        }
    }

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
                </div><hr>
            `;
        });

        if (!currentUser) {
            currentUser = usernameInput.value.trim() || "Anonymous";
        }
        saveScore(currentUser, correctCount);

        resultHTML += `<button id="restart-btn">Restart Quiz</button>`;
        questionContainer.innerHTML = resultHTML;
        document.getElementById("restart-btn").addEventListener("click", restartQuiz);
    }

    function restartQuiz() {
        questionContainer.innerHTML = "";
        userAnswers = [];
        fetchLeaderboard();
    }

    function saveScore(username, score) {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push({ username, score });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        // Send data to backend (db.json)
        fetch("http://localhost:3000/leaderboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, score })
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to save score to backend");
            return response.json();
        })
        .then(data => {
            console.log("Score saved to backend:", data);
            fetchLeaderboard(); // Refresh leaderboard from backend
        })
        .catch(error => console.error("Error saving score:", error));
    }

    function fetchLeaderboard() {
        fetch("http://localhost:3000/leaderboard")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch leaderboard");
                return response.json();
            })
            .then(leaderboard => {
                leaderboardList.innerHTML = "";
                leaderboard
                    .sort((a, b) => b.score - a.score) // Sort by highest score
                    .forEach((entry, index) => {
                        const li = document.createElement("li");
                        li.innerHTML = `<strong>${index + 1}. ${entry.username}</strong>: ${entry.score} points`;
                        leaderboardList.appendChild(li);
                    });
            })
            .catch(error => console.error("Error fetching leaderboard:", error));
    }

    startBtn.addEventListener("click", () => {
        currentUser = usernameInput.value.trim() || "Anonymous";
        let numQuestions = parseInt(numQuestionsInput.value);
        fetchQuestions(numQuestions);
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < questionHistory.length - 1) {
            currentIndex++;
            displayQuestion();
        } else {
            showResults();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayQuestion();
        }
    });

    fetchLeaderboard();
});
