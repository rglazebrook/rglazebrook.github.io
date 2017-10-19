var 
_loop = 0,
level = 1,
maze,
rows,
cols,
scale,
colors = '#fff #000 #fc0 #f00 #0f0'.split(' '),
dragon = {
  x: 0,
  y: 0,
  movingHorizontal: 0,
  movingVertical: 0,
  moveRate: 0.08,
  lastCell: [],
 init: function() {
    this.movingHorizontal = this.movingVertical = this.horizontal = this.vertical = 0;
    this.x = maze.dragon[1]+1;
    this.y = maze.dragon[0]+1;
    this.lastCell = [-1,-1];
  },
  update: function() {

    // If we're moving, do so. We check for 'close' because floating points are imprecise.
    if (this.movingHorizontal !== 0) {
      this.x += this.moveRate * this.movingHorizontal;
      if (this.x % 1 > 1 - this.moveRate || this.x % 1 < this.moveRate) {
        this.movingHorizontal = 0;
        this.x = Math.round(this.x);
      }
    } 
    else if (this.movingVertical !== 0) {
      this.y += this.moveRate * this.movingVertical;
      if (this.y % 1 > 1 - this.moveRate || this.y % 1 < this.moveRate) {
        this.movingVertical = 0;
        this.y = Math.round(this.y);
      }
    }    

    // If we're not currently moving, give it a chance
    if (this.movingHorizontal === 0 && this.movingVertical === 0 && Math.random() > 0.95) {

      // Find which ways we could move.
      var options = [];
      if (isOpen(this.x, this.y - 1)) options.push([this.y - 1, this.x]);
      if (isOpen(this.x, this.y + 1)) options.push([this.y + 1, this.x]);
      if (isOpen(this.x - 1, this.y)) options.push([this.y, this.x - 1]);
      if (isOpen(this.x + 1, this.y)) options.push([this.y, this.x + 1]);

      // If we have more than one choice, generally don't go back to where we just were.
      if (options.length > 1) {
        var l = options.length;
        //console.log(options);
        while(l--) {
          if (options[l][0] == this.lastCell[0] && options[l][1] == this.lastCell[1]) {
            if (Math.random() > .2) options.splice(l,1); // ~20% chance we'll still consider turning around.
            break;
          }
        }
      }

      // Chose randomly from available options and start moving.
      if (options.length) {
        var choice = options[~~(Math.random() * options.length)];
        if (choice[0] == this.y) this.movingHorizontal = choice[1] > this.x ? 1 : -1;
        else this.movingVertical = choice[0] > this.y ? 1 : -1;
        this.lastCell = [this.y, this.x];
      } else {
        console.log('Could not find anywhere to go.')
      }
    }

    // Draw the dragon.
    c.fillStyle = colors[3];
    c.fillRect(this.x * scale, this.y * scale, scale, scale);
  }
},
hero = {
  x: 0,
  y: 0,
  bombs: 0,
  vertical: 0,
  horizontal: 0,
  movingHorizontal: 0,
  movingVertical: 0,
  bombing: false,
  moveRate: 0.1,
  init: function() {
    this.movingHorizontal = this.movingVertical = this.horizontal = this.vertical = 0;
    this.bombing = false;
    this.bombs = 1;
    this.x = maze.start[1]+1;
    this.y = maze.start[0]+1;
  },
  update: function() {

    // Take care of any ongoing moves.
    if (this.movingHorizontal !== 0) {
      this.x += this.moveRate * this.movingHorizontal;
      if (this.x % 1 > 1 - this.moveRate/2 || this.x % 1 < this.moveRate/2) {
        this.movingHorizontal = 0;
        this.x = Math.round(this.x);
      }
    } 
    else if (this.movingVertical !== 0) {
      this.y += this.moveRate * this.movingVertical;
      if (this.y % 1 > 1 - this.moveRate /2 || this.y % 1 < this.moveRate /2) {
        this.movingVertical = 0;
        this.y = Math.round(this.y);
      }
    }

    // Take care of any attempted moves.
    if (this.horizontal !== 0 && !this.movingVertical && !this.movingHorizontal && isOpen(this.x + this.horizontal, this.y)) {
      this.movingHorizontal = this.horizontal;
    }
    else if (this.vertical !== 0 && !this.movingVertical && !this.movingHorizontal && isOpen(this.x, this.y + this.vertical)) {
      this.movingVertical = this.vertical;
    }

    // If we're bombing a wall, take out the wall.
    else if (this.bombing && this.bombs > 0) {
      maze.map[this.y + this.vertical][this.x + this.horizontal] = 0;
      this.bombs--;
    }

    // If we're touching the dragon, we die and start over.
    if (touches(hero, dragon)) {
     alert('The dragon got you. You made it to level ' + level + '. Hit OK to restart.');
     level = 1;
     startLevel();
    }

    // If we're touching the gold, we win and go to the next level.
    if (touches(hero, goal)) {
      alert('Congrats! Ready to start the next level?');
      level++;
      startLevel();
    }

    // Draw player.
    c.fillStyle = colors[4];
    c.fillRect(this.x * scale, this.y * scale, scale, scale);
  }
},
goal = {
  x: 0,
  y: 0,
  init: function() {
    this.x = maze.goal[1]+1;
    this.y = maze.goal[0]+1;
  },
  update: function() {
    c.fillStyle = colors[2];
    c.fillRect(this.x * scale, this.y * scale, scale, scale);
  }
},

init = function() {

  bindKeys();
  startLevel();
  loop();

},

update = function() {
  drawMaze();
  hero.update();
  dragon.update();
  goal.update();

},

startLevel = function() {
  maze = genMaze(5 + level, 5 + level);
  rows = maze.map.length;
  cols = maze.map[0].length;
  scale = Math.floor(Math.min(a.width, a.height) / Math.min(rows, cols));

  hero.init();
  dragon.init();
  goal.init();
},

loop = function() {
  update();
  _loop = requestAnimationFrame(loop);
},

bindKeys = function() {

  document.onkeydown = function(e) {
    switch (e.keyCode) { 
      case 38: 
        hero.vertical = -1;
        break;
      case 40: // Down key: move backwards.
        hero.vertical = 1;
        break;
      case 37: // Left.
        hero.horizontal = -1;
        break;
      case 39: // Right.
        hero.horizontal = 1;
        break;
      case 66: // b key for bombs.
        hero.bombing = true;
    }
  };
  document.onkeyup = function(e) {
    switch (e.keyCode) {
      case 38:
      case 40:
        hero.vertical = 0;
        break;
      case 37:
      case 39:
        hero.horizontal = 0;
        break;
      case 66:
        hero.bombing = false;
    }
  };
},

// Check if a cell is open
isOpen = function(x, y) {
  if(x < 0 || x >= cols || y < 0 || y >= rows || maze.map[~~y] == 'undefined' || maze.map[~~y][~~x] == 'undefined') return false;
  return maze.map[~~y][~~x] === 0;
},

// Checks if two objects with x/y coordinates and sizes intersect.
touches = function(obj1, obj2) {
  var x = Math.max(0, Math.min(obj1.x + 1, obj2.x + 1) - Math.max(obj1.x, obj2.x)),
      y = Math.max(0, Math.min(obj1.y + 1, obj2.y + 1) - Math.max(obj1.y, obj2.y));
  return (x && y); // Will return 0 (falsy) if no intersect, a positive (truthy) value if there is one.
},

genMaze = function(rows, cols) {
  var m = genEmpty(rows * 2 - 1, cols * 2 - 1, 1),
      first = [Math.floor(Math.random() * rows) * 2, Math.floor(Math.random() * cols) * 2],
      goal = [],
      route = [],
      current = first,
      last = [],
      unvisited = rows * cols - 1;

  // Set our first square as a 2.
  m[current[0]][current[1]] = 0;

  // Loop through until we've visited every cell.
  while(unvisited > 0) {

    // Find our unvisited neighbors. We'll save four coordinates for any neighbor we find:
    // The first two are the neighbor, the second two are the wall between that would be removed.
    var n = [];
    if(m[current[0] - 2]  && m[current[0] - 2][current[1]] == 1) n.push([current[0] - 2, current[1], current[0] - 1, current[1]]);
    if(m[current[0] + 2]  && m[current[0] + 2][current[1]] == 1) n.push([current[0] + 2, current[1], current[0] + 1, current[1]]);
    if(m[current[0]][current[1] - 2] == 1) n.push([current[0], current[1] - 2, current[0], current[1] - 1]);
    if(m[current[0]][current[1] + 2] == 1) n.push([current[0], current[1] + 2, current[0], current[1] + 1]);

    // If we have one or more unvisited neighbor, select one randomly, remove the wall between, and go there.
    if(n.length) {
      var next = n[~~(Math.random() * n.length)];
      m[next[0]][next[1]] = 0;
      m[next[2]][next[3]] = 0;
      route.push(current);
      current = [next[0], next[1]];

      // If this is the last cell to visit, put our dragon here.
      if(unvisited == 1) {
        // m[current[0]][current[1]] = 4;
        last = [current[0], current[1]];
      }

      unvisited--;
    } 
 
    // If we have no unvisited neighbors, go back one.
    else {
      // Set this square as our 'goal' if we don't one yet.
      if (goal.length === 0) goal = [current[0], current[1]];

      current = route.pop();
    }

  }

  // Surround our maze with walls.
  m.unshift(genEmpty(1, cols * 2 - 1, 1)[0]);
  m.push(genEmpty(1, cols * 2 - 1, 1)[0]);
  for (var r = 0; r < m.length; r++) {
    m[r].unshift([1]);
    m[r].push([1]);
  }

  return {map: m, start: first, goal: goal, dragon: last};
},

genEmpty = function (rows, cols, fill) {
  var arr = [];
  for (var r = 0; r < rows; r++) {
    arr[r] = [];
    for (var c = 0; c < cols; c++) {
      arr[r][c] = fill;
    }
  }
  return arr; 
},

drawMaze = function() {
  c.fillStyle = colors[0];
  c.fillRect(0,0, a.width, a.height);
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      c.fillStyle = colors[maze.map[row][col]];
      c.fillRect(col * scale, row * scale, scale, scale);
    }
  }
};

init();