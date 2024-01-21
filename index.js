const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const shootingSound = new Audio("./audios/laser-gun.mp3");
const playerDeath = new Audio("./audios/player-death-explosion.mp3");
const megaSound = new Audio("./audios/spaceship-cannon-load-shoot.mp3");
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
    this.showEnemyInterval = null;
    this.destroyEnemyInterval = null;
    this.isMuted = false;

    this.playBtn.addEventListener("click", () => this.startGame());
    this.stopBtn.addEventListener("click", () => this.stopGame());
    this.rocket.addEventListener("mousedown", (e) => this.fireBullet(e));
    this.rocket.addEventListener("mouseup", () => this.stopFire());
  }

  startGame() {
    this.stopBtn.style.display = "inline-block";
    this.playBtn.style.display = "none";
    this.titleContainer.style.display = "none";
    audio.play();

    this.playground.addEventListener("mousemove", (e) => this.moveRocket(e));
    this.showEnemyInterval = setInterval(() => this.createEnemy(), 3000);
    this.destroyEnemyInterval = setInterval(() => this.destroyEnemy(), 90);
  }

  stopGame() {
    this.enemiesContainer.innerHTML = "";
    this.stopBtn.style.display = "none";
    this.playBtn.style.display = "inline-block";
    this.playground.removeEventListener("mousemove", (e) => this.moveRocket(e));
    this.resetRocketPosition();
    clearInterval(this.showEnemyInterval);
    clearInterval(this.destroyEnemyInterval);
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
      this.clearShootingSoundInterval = setInterval(
        () => shootingSound.play(),
        30
      );
    }

    onkeydown = (e) => {
      if (e.key === "s") {
        console.log("S is pressed");
        this.isMuted = true;
        clearInterval(this.clearShootingSoundInterval);
      }
    };
    if (e.button === 1) {
      this.fireingInterval = setInterval(() => this.createBullet(), 400);
    }
  }

  stopFire() {
    this.bulletsContainer.innerHTML = "";
    clearInterval(this.fireingInterval);
    clearInterval(this.clearShootingSoundInterval);
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

    bullets.forEach((bullet) => {
      let bulletRect = bullet.getBoundingClientRect();

      enemies.forEach((enemy) => {
        let enemyRect = enemy.getBoundingClientRect();

        if (this.isCollision(bulletRect, enemyRect)) {
          this.points.innerHTML = parseInt(this.points.innerHTML) + 1;
          enemy.remove();
          bullet.remove();
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
