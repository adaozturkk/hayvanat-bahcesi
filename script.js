const size = 500;
const animals = [];
let moveCounter = 0;

// Base class for all animals
class Animal {
  constructor(type, gender, moveStep) {
    this.type = type;
    this.gender = gender;
    this.moveStep = moveStep;
    this.x = getRandomNumber(0, size);
    this.y = getRandomNumber(0, size);
    this.isAlive = true;
  }

  // Move the animal based on moveStep
  move() {
    for (let i = 0; i < this.moveStep; i++) {
      let randomAxis = getRandomNumber(0, 1);
      let randomDirection = getRandomNumber(0, 1);

      // For x axis
      if (randomAxis === 0) {
        if (randomDirection === 0) {
          this.x--;
          moveCounter++;
        } else {
          this.x++;
          moveCounter++;
        }
        // For y axis
      } else {
        if (randomDirection === 0) {
          this.y--;
          moveCounter++;
        } else {
          this.y++;
          moveCounter++;
        }
      }

      // Control bounds for keeping animal inside the area
      if (this.x > size) {
        moveCounter--;
        this.x = size;
      } else if (this.x < 0) {
        moveCounter--;
        this.x = 0;
      } else if (this.y > size) {
        moveCounter--;
        this.y = size;
      } else if (this.y < 0) {
        moveCounter--;
        this.y = 0;
      }
    }
  }
}

// An inherited class for hunter
class Hunter extends Animal {
  constructor() {
    super("avcı", "erkek", 1);
  }
}

// Initialize animals and hunter
createAnimals("koyun", 2, 30);
createAnimals("inek", 2, 10);
createAnimals("tavuk", 1, 10);
createAnimals("kurt", 3, 10);
createAnimals("horoz", 1, 10);
createAnimals("aslan", 4, 8);
const hunter = new Hunter();

// Until 1000 total movements, apply program logic
while (moveCounter <= 1000) {
  CheckHuntingAnimals();
  CheckHuntingHunter();
  CheckBreeding();

  animals.forEach((animal) => {
    if (animal.isAlive) {
      animal.move();
    }
  });

  hunter.move();
}

// Display each animal's count for program output
const typeCounts = {};
animals.forEach((animal) => {
  if (animal.isAlive) {
    typeCounts[animal.type] = (typeCounts[animal.type] || 0) + 1;
  }
});

console.log("Toplam 1000 birim hareket sonunda hayvan sayıları:");
for (let type in typeCounts) {
  console.log(`${type} = ${typeCounts[type]}`);
}

// ----------- FUNCTIONS -----------

// Create animals with equal number of genders for each type
function createAnimals(type, moveStep, count) {
  let gender;

  for (let i = 0; i < count; i++) {
    gender = i % 2 === 0 ? "dişi" : "erkek";
    animals.push(new Animal(type, gender, moveStep));
  }
}

// Check if an animal can hunt another one
function CheckHuntingAnimals() {
  for (let animal of animals) {
    if (!animal.isAlive) continue;

    if (animal.type === "kurt") {
      animals.forEach((hunt) => {
        if (
          (hunt.type == "koyun" ||
            hunt.type == "tavuk" ||
            hunt.type == "horoz") &&
          getDistance(animal, hunt) <= 4 &&
          hunt.isAlive
        ) {
          hunt.isAlive = false;
        }
      });
    }

    if (animal.type === "aslan") {
      animals.forEach((hunt) => {
        if (
          (hunt.type == "koyun" || hunt.type == "inek") &&
          getDistance(animal, hunt) <= 5 &&
          hunt.isAlive
        ) {
          hunt.isAlive = false;
        }
      });
    }
  }
}

// Check if hunter can hunt an animal
function CheckHuntingHunter() {
  animals.forEach((animal) => {
    if (animal.isAlive && getDistance(animal, hunter) <= 8) {
      animal.isAlive = false;
    }
  });
}

// Create new animals if 2 animal has same type but different genders
function CheckBreeding() {
  const newborns = [];

  for (let i = 0; i < animals.length; i++) {
    for (let j = i + 1; j < animals.length; j++) {
      let firstAnimal = animals[i];
      let secondAnimal = animals[j];

      if (
        firstAnimal.isAlive &&
        secondAnimal.isAlive &&
        firstAnimal.type === secondAnimal.type &&
        firstAnimal.gender !== secondAnimal.gender &&
        getDistance(firstAnimal, secondAnimal) <= 3
      ) {
        let gender = getRandomNumber(0, 1) === 0 ? "dişi" : "erkek";

        newborns.push(
          new Animal(firstAnimal.type, gender, firstAnimal.moveStep)
        );
      }
    }
  }

  animals.push(...newborns);
}

// Generates random number within the specified range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate distance between 2 locations
function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
