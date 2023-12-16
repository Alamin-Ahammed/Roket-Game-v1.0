

class SpaceShooterGame {
  constructor() {
    this.playBtn = document.querySelector(".playbtn");
    this.stopBtn = document.querySelector(".stopbtn");
    this.playground = document.querySelector(".playground");
    this.rocket = document.querySelector(".Rocket");
    this.bulletsContainer = document.querySelector(".bullets");
    this.enemiesContainer = document.querySelector(".enemies");
    this.showEnemyInterval = null;
    this.destroyEnemyInterval = null;

    this.playBtn.addEventListener("click", () => this.startGame());
    this.stopBtn.addEventListener("click", () => this.stopGame());
    this.rocket.addEventListener("mousedown", (e) => this.fireBullet(e));
    this.rocket.addEventListener("mouseup", () => this.stopFire());
  }

  startGame() {
    this.stopBtn.style.display = "inline-block";
    this.playBtn.style.display = "none";

    this.playground.addEventListener("mousemove", (e) => this.moveRocket(e));
    this.showEnemyInterval = setInterval(() => this.createEnemy(), 3000);
    this.destroyEnemyInterval = setInterval(() => this.destroyEnemy(), 90);
  }

  stopGame() {
    this.enemiesContainer.innerHTML = '';
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
    if (e.button === 1) {
      this.fireingInterval = setInterval(() => this.createBullet(), 400);
    }
  }

  stopFire() {
    this.bulletsContainer.innerHTML = "";
    clearInterval(this.fireingInterval);
  }

  createBullet() {
    let newBullet = document.createElement("div");
    newBullet.classList.add("bullet");
    newBullet.classList.add("animate");
    this.bulletsContainer.appendChild(newBullet);

    if (this.bulletsContainer.children.length > 3) {
      this.bulletsContainer.removeChild(this.bulletsContainer.firstElementChild);
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
    let bullets = this.bulletsContainer.querySelectorAll('.bullet');
    let enemies = this.enemiesContainer.querySelectorAll('.enemy');

    bullets.forEach(bullet => {
      let bulletRect = bullet.getBoundingClientRect();

      enemies.forEach(enemy => {
        let enemyRect = enemy.getBoundingClientRect();

        if (this.isCollision(bulletRect, enemyRect)) {
          enemy.remove();
          bullet.remove();
        }
      });
    });
  }

  isCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y;
  }
}

// Initialize the game
const spaceShooterGame = new SpaceShooterGame();


