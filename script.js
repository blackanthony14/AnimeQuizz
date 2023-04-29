$(document).ready(function () {
  const quizContainer = document.getElementById("quiz-container");
  let currentQuestion = 0;
  let score = 0;
  let animeData = [];
  const totalRounds = 10;
  let currentRound = 1;
  startQuiz();

  // Start quiz
  function startQuiz() {
    showQuestion();
  }

  async function getRandomAnime() {
    while (true) {
      const randomId = Math.floor(Math.random() * 2727);
      const apiUrl = `https://api.jikan.moe/v4/anime/${randomId}`;
    
      try {
        const response = await fetch(apiUrl);
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.json();
        if (data.data) {
          return data;
        }
      } catch (error) {
        console.error("There was a problem fetching the anime data:");
      }
    }
  }
  

  // Show question
  async function showQuestion() {
    if (currentRound <= totalRounds) {
      quizContainer.innerHTML = "";
      const anime = await getRandomAnime();
      const imageUrl = anime.data.images.webp.image_url;
      const op1 = await getRandomAnime();
      const op2 = await getRandomAnime();
      const options = [anime.data.title, op1.data.title, op2.data.title];
      options.sort(() => Math.random() - 0.5);
  
      const img = document.createElement("img");
      img.setAttribute("src", imageUrl);
      quizContainer.appendChild(img);
  
      // Wait for the image to load before starting the timer
      await new Promise((resolve, reject) => {
        img.addEventListener("load", () => {
          resolve();
        });
        img.addEventListener("error", () => {
          reject();
        });
      });
  
      const timerBar = document.createElement("div");
      timerBar.classList.add("timer-bar");
      quizContainer.appendChild(timerBar);
  
      let timeRemaining = 10; // Set the initial time remaining
      const timerInterval = setInterval(() => {
        timeRemaining -= 0.1;
        timerBar.style.width = (timeRemaining / 10) * 100 + "%";
        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          currentQuestion++;
          if (currentQuestion < animeData.length) {
            showQuestion();
          } else {
            currentRound++;
            showQuestion();
          }
        }
      }, 100);
  
      options.forEach((option) => {
        const div = document.createElement("div");
        div.classList.add("quiz-option");
        div.textContent = option;
        div.addEventListener("click", () => {
          clearInterval(timerInterval); // Stop the timer when an option is clicked
          if (option === anime.name) {
            score++;
          }
          currentQuestion++;
          if (currentQuestion < animeData.length) {
            showQuestion();
          } else {
            currentRound++;
            showQuestion();
          }
        });
        quizContainer.appendChild(div);
      });
    } else {
      endQuiz();
    }
  }
  
  
  

  // End quiz
  function endQuiz() {
    let message;
    let message2;
    if (score === 0) {
      message = "Are you a noob?";
      message2 = "Looks like you need to brush up on your anime knowledge. Keep trying and maybe you'll get a better score next time!";
    } else if (score >= 1 && score <= 3) {
      message = "Kinda Decent";
      message2= "You've got some work to do, but you're on the right track. Keep watching and learning!";
    } else if (score >= 4 && score <= 6) {
      message = "You are impressive";
      mesage2 = "You know your stuff when it comes to anime. Keep up the good work!"
    } else if (score >= 7 && score <= 9) {
      message = "You don't have life";
      message2 = "Your knowledge of anime is extensive. Keep up the great work and continue exploring new shows and movies.";
    } else if (score === 10) {
      message = "Stop watching anime please.";
      message2 = "Your knowledge of anime is extensive. Keep up the great work and continue exploring new shows and movies.";
    }
    
    quizContainer.innerHTML = `
      <h2>Congratulation!</h2>
      <h2>You scored ${score} out of ${totalRounds}!</h2>
      <p>${message}</p>
      <p>${message2}</p>
      <div class="center">
      <button class="btn" id="start-btn" onClick="location.reload()">
        <svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
          <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
          <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
        </svg>
        <span>Play again</span>
      </button>
      </div>
    `;
  }
  
});
