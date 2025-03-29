# MindQuest - Trivia Game

MindQuest is an engaging and interactive trivia game designed to test your knowledge across multiple categories. Built with **HTML, CSS, and JavaScript**, it dynamically fetches trivia questions from the **Open Trivia Database (OpenTDB) API** to provide a fresh and exciting experience every time you play.

## Live Demo  
[Play MindQuest Now](https://devbrianke.github.io/MindQuest/)

## Backend Repository  
- Backend Repository: [MindQuest Backend](https://github.com/DevBrianKE/trivia-backend)

## Features  
- Fetches random multiple-choice trivia questions from **OpenTDB API**.  
- Users can customize the number of questions (1-20).  
- Interactive UI with highlighted selections for better engagement.  
- Supports **Next** and **Previous** navigation between questions.  
- Displays a detailed **final results** summary, showing correct and incorrect answers.  
- Option to restart the quiz for continuous play.  
- **Leaderboard integration**: Stores player scores in a database hosted on **Render**.

## Backend & Leaderboard Integration
MindQuest now features a **Node.js backend** hosted on **Render** that handles the leaderboard functionality. When a player finishes the quiz and submits their score, the data is sent to the backend, which stores it in a **database**. The leaderboard dynamically retrieves and displays the top scores.

### Backend Features
- Stores leaderboard data in a **database hosted on Render**.  
- API endpoints for submitting and retrieving top scores.  
- Secure and scalable to handle multiple player submissions.  

### How the Leaderboard Works
1. When a player completes the quiz on the **GitHub Pages frontend**, their name and score are sent via an API request to the backend.  
2. The backend **stores** this data in the **database** hosted on **Render**.  
3. The frontend fetches and displays the **top scores** from the leaderboard in real time.
4. When you add a memeber the member is reflect on the db.json in vs-code  

## Tech Stack  
MindQuest is built using the following technologies:

### Frontend:
- **HTML5** – Provides the structure and layout of the game.  
- **CSS3** – Used for styling, animations, and responsive design.  
- **JavaScript (ES6+)** – Implements the game logic and handles API interactions.  
- **OpenTDB API** – Supplies dynamic and diverse trivia questions.  

### Backend:
- **Render** – Hosts the backend API.  

## How to Play  
1. Enter the number of questions you want to answer (between **1 and 20**).  
2. Click the **Start Quiz** button to begin.  
3. Select an answer for each question by clicking on your choice.  
4. Use the **Next** and **Previous** buttons to navigate through the quiz.  
5. At the end, review your **final score** along with correct and incorrect answers.  
6. Your score will be sent to the **leaderboard** for ranking.  
7. Click **Restart Quiz** to play again.  

## Installation & Setup  
To run the game locally, follow these steps:

### Frontend:
1. Clone the repository:  
   ```sh
   git clone https://github.com/your-username/MindQuest.git
   ```  
2. Navigate to the project folder:  
   ```sh
   cd MindQuest
   ```  
3. Open `index.html` in your browser or use **Live Server** for an enhanced experience.  

### Backend:
1. Clone the backend repository:  
   ```sh
   git clone https://github.com/your-username/trivia-backend.git
   ```  
2. Navigate to the backend folder:  
   ```sh
   cd trivia-backend
   ```  
3. Install dependencies:  
   ```sh
   npm install
   ```  
4. Create a `.env` file and configure database credentials:  
   ```sh
   DATABASE_URL=mongodb+srv://your-database-url
   ```  
5. Start the backend server:  
   ```sh
   node server.js
   ```  

## Contributing  
We welcome contributions! To improve the game, follow these steps:

1. **Fork** the repository.  
2. Create a new branch:  
   ```sh
   git checkout -b feature-name
   ```  
3. Make your changes and commit them:  
   ```sh
   git commit -m "Added a new feature"
   ```  
4. Push to your forked repository:  
   ```sh
   git push origin feature-name
   ```  
5. Open a **Pull Request** with a detailed description of your changes.  

## License  
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.


