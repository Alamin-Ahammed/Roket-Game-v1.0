const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const shootingSound = new Audio("./audios/laser-gun.mp3");
const playerDeath = new Audio("./audios/player-death-explosion.mp3");
const megaSound = new Audio("./audios/spaceship-cannon-load-shoot.mp3");
const gameoverSound = new Audio('./audios/gameoverVoice.m4a');
class SpaceShooterGame {
  constructor() {
    this.playBtn = document.querySelector(".playbtn");
    this.stopBtn = document.querySelector(".stopbtn");
    this.playground = document.querySelector(".playground");
    this.rocket = document.querySelector(".Rocket");
    this.bulletsContainer = document.querySelector(".bullets");
    this.enemiesContainer = document.querySelector(".enemies");
    this.points = document.querySelector(".points");
    this.titleContainer = document.querySelector(".titleContainer");
    this.gameover = document.querySelector(".gameover");
    this.playAgainBtn = document.querySelector(".playagainbtn")
    this.showEnemyInterval = null;
    this.destroyEnemyInterval = null;
    this.isMuted = false;
    this.count = 0;

    this.playBtn.addEventListener("click", () => this.startGame());
    this.stopBtn.addEventListener("click", () => this.stopGame(this.playBtn,"inline-block"));
    this.playAgainBtn.addEventListener('click', () => this.resetGame());
    document.addEventListener("keydown", (e) => {
      if (e.key === "f" && this.stopBtn.style.display != "none") {
        if (this.count % 3 === 0) {
          this.fireBullet(e);
        }
        if (this.count === 15) {
          this.count = 0;
        }
        this.count++;
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "f") {
        setTimeout(() => {
          this.stopFire();
        }, 300);
        this.count = 0;
      }
    });
  }

  startGame() {
    this.stopBtn.style.display = "inline-block";
    this.playBtn.style.display = "none";
    this.titleContainer.style.display = "none";
    audio.play();
    this.playground.addEventListener("mousemove", (e) => this.moveRocket(e));
    this.showEnemyInterval = setInterval(() => this.createEnemy(), 3000);
    this.destroyEnemyInterval = setInterval(() => this.destroyEnemy(), 90);
    this.isCollision();
  }

  stopGame(element,property) {
    this.enemiesContainer.innerHTML = "";
    this.stopBtn.style.display = "none";
    element.style.display = property;
    this.playground.removeEventListener("mousemove", (e) => this.moveRocket(e));
    this.resetRocketPosition();
    this.stopFire();
    clearInterval(this.showEnemyInterval);
    clearInterval(this.destroyEnemyInterval);
  }

  resetGame() {
    // Clear intervals
    clearInterval(this.showEnemyInterval);
    clearInterval(this.destroyEnemyInterval);

    // Reset elements
    this.enemiesContainer.innerHTML = "";
    this.bulletsContainer.innerHTML = "";
    this.points.innerHTML = "0";
    this.resetRocketPosition();
    this.stopFire();
    // Reset gameover text
    this.gameover.classList.remove('showGameover');
    this.playAgainBtn.style.display = 'none';
    this.rocket.style.display = 'block';
    // Start the game again
    this.startGame();
  }


  moveRocket(e) {
    this.rocket.style.left = `${e.clientX}px`;
    this.rocket.style.top = `${e.clientY - 80}px`;
  }

  resetRocketPosition() {
    this.rocket.style.left = `${50}%`;
    this.rocket.style.top = `${0}px`;
  }

  fireBullet(e) {
    if (!this.isMuted) {
      if (e.key === "f") {
        shootingSound.play();
      }
    }

    onkeydown = (e) => {
      if (e.key === "s") {
        this.isMuted = true;
      }
    };
    if (e.key === "f") {
      this.createBullet();
    }
  }

  blastEffect(
    elementToHide,
    hidingelemRectX,
    hidingelemRectY,
    pathOfGifEffectToShow
  ) {
    elementToHide.style.display = "none";
    const gif = document.createElement("img");
    gif.src = pathOfGifEffectToShow;
    gif.style.position = "absolute";
    gif.style.top = hidingelemRectY - gif.width / 2.5 + "px";
    gif.style.left = hidingelemRectX - gif.height / 2.5 + "px";
    gif.style.borderRadius = "50%";
    document.body.appendChild(gif);
    console.log(gif);
    setTimeout(() => {
      gif.remove();
    }, 500);
  }

  stopFire() {
    this.bulletsContainer.innerHTML = "";
  }

  createBullet() {
    let newBullet = document.createElement("div");
    newBullet.classList.add("bullet");
    newBullet.classList.add("animate");
    this.bulletsContainer.appendChild(newBullet);

    if (this.bulletsContainer.children.length > 3) {
      this.bulletsContainer.removeChild(
        this.bulletsContainer.firstElementChild
      );
    }
  }

  createEnemy() {
    let randomXAxis = Math.round(Math.random() * 1000);
    let enemyBody = document.createElement("div");
    enemyBody.classList.add("enemy");
    enemyBody.style.left = `${randomXAxis}px`;
    this.enemiesContainer.appendChild(enemyBody);
  }

  destroyEnemy() {
    let bullets = this.bulletsContainer.querySelectorAll(".bullet");
    let enemies = this.enemiesContainer.querySelectorAll(".enemy");

    enemies.forEach((enemy) => {
      let enemyRect = enemy.getBoundingClientRect();
      const rocketRect = this.rocket.getBoundingClientRect();
      if (this.isCollision(rocketRect, enemyRect)) {
        playerDeath.play();
        this.blastEffect(this.rocket, rocketRect.left,rocketRect.top,"./img/Blast.gif")
        setTimeout(() => {
          gameoverSound.play();
        }, 700);
        this.gameover.classList.add("showGameover");
        this.stopGame(this.playAgainBtn,'inline-flex');
      }
    });
    bullets.forEach((bullet) => {
      let bulletRect = bullet.getBoundingClientRect();
      enemies.forEach((enemy) => {
        let enemyRect = enemy.getBoundingClientRect();

        if (this.isCollision(bulletRect, enemyRect)) {
          this.points.innerHTML = parseInt(this.points.innerHTML) + 1;
          enemy.remove();
          bullet.remove();
          playerDeath.play();
          this.blastEffect(
            enemy,
            enemyRect.left,
            enemyRect.top,
            "./img/Blast.gif"
          );
        }
      });
    });
  }

  isCollision(rect1, rect2) {
    // rect1 is the bulletRect  &&  rect2 is the enemyRect
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
}

const spaceShooterGame = new SpaceShooterGame();
