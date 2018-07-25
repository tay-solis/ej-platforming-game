/*
Game based on Eloquent Javascript Ch. 16
https://eloquentjavascript.net/16_game.html
*/

/*
Levels formed using a string.
Ex.
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................
Where:
# are walls or boundaries,
@ is the player,
o are coins,
= are moving obstacles,
+ is lava.
*/

let tutorialLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

class Level {
  //Takes one argument: Level string
  constructor(plan){
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type == "string") return type;
        this.startActors.push(type.create(new Vec (x, y), ch));
        return "empty";
      });
    });
  }
}

/*
Track the state of a running game
status will switch to "lost" or "won" respectively.
*/
class State{
  constructor(level, actors, status){
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level){
    return new State(level, level.startActors, "playing");
  }

  get player(){
    return this.actors.find(a => a.type == "player");
  }
}

/*
Actor objects represent the current position/state of an element in the game.
Includes player, coin, lava
pos: coordinates of top corner
size: size of Actor
type: "player", "coin", "lava"
create(): create an actor on the level.
*/

/* Vec objects are two dimensional. */

class Vec{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  plus(other){
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor){
    return new Vec (this.x * factor, this.y * factor);
  }
}

/*
Player objects
speed: stores current momentum and gravity
pos: stores current coordinates
*/

class Player{
  constructor(pos, speed){
    this.pos = pos;
    this.speed = speed;
  }

  get type(){ return "player"; }

  static create (pos){
    return new Player( pos.plus(new Vec(0, 0.5)), new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);

/*
There are two kinds of Lava: dynamic and still Lava
Dynamic lava moves along current speed until it hits an obstacle.
Reset: It will jump back to its start position (dripping)
No Reset: Will invert speed and continue (bouncing)
*/

class Lava{
  constructor(pos, speed, reset){
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type(){ return "lava"; }

  static create(pos, ch){
    if (ch == "="){
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|"){
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v"){
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);

/*
Coins sit in place.
Wobble: A slight movement.
*/

class Coin{
  constructor(pos, basePos, wobble){
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type(){ return "coin"; }

  static create(pos){
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }
}

const levelChars = {
  ".": "empty",
  "#": "wall",
  "+": "lava",
  "@": Player,
  "o": Coin,
  "=": Lava,
  "|": Lava,
  "v": Lava
}

//Game

let tutorialLevel = new Level(tutorialLevelPlan);
console.log(`${tutorialLevel.width} by ${tutorialLevel.height}`)
