# Conway's Game of Life

A TypeScript library for [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) that supports a typical implementation, multi-color versions and other variations on the standard game.

This library does not support any mechanism to output the board; users are responsible for its display, this library merely calculates the state of the game board at each generation.

See [examples/life.js](examples/life.js) for an example of a console application that will draw the board.

## Usage

1. Create a new instance of the `Life` object - with optional width and height of the game board:

        const life = new Life(width, height);

2. Set the initial conditions.  The initial board is blank, but you can either randomize the layout of the populants of the board:

        life.randomize();

    Or you can place the population explicitly - given the `x`/`y` coordinates of the board, you can set a cell to have a live populant:

        life.set(x, y, 1);

    Or to have a no populant:

        life.set(x, y, 0);

3. Get the board data.  You can get the value of a single cell by its `x`/`y` coordinates:

        const alive = life.get(x, y);

4. Move on to the next generation.

        life.next();

    Then you can continue displaying the board (go to step 3).

## Example

Add the [`dat-life`](http://npmjs.com/dat-life) package (eg, `npm install dat-life`).  Then:

```javascript
const { Life } = require('dat-life');

const boardWidth = 80; // width of the game board
const boardHeight = 24; // height of the game board

const life = new Life(boardWidth, boardHeight);
life.randomize(); // set up the initial board with random populantss

while (true) {
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            if (life.get(x, y)) {
                process.stdout.write('*');
            }
            else {
                process.stdout.write(' ');
            }
        }

        process.stdout.write('\n');
    }

    processs.stdout.line('\n');
    life.next();
}
```

## Color mode

This package supports the [standard 2- and 4-color versions of the Game of Life](https://conwaylife.com/ref/mniemiec/color.htm) (called _immigration_ and _quad-life_, respectively).

```javascript
    life.setColors(2); // immigration
    life.setColors(4); // quad-life
```

The default 2- and 4-color versions both handle the birth and death of cells like the default Game of Life does - meaning that cells live and die according to the default rules, but coloring is based on unrelated rules.

This package also supports a new "decay" mode, which changes the way way that alive cells die in color mode.

```javascsript
    life.setDecay(true); // decay mode
```

In decay mode, cells do not simply die from overcrowding or exposure.  Instead, cells are reduced by a color value.  (So if a cell is at color `3` but has overcrowding, by default when the cell has overcrowding, it would move from color `3` to dead.  In decay mode, the color is simply reduced - so color `3` changes to color `2`.)

Decay mode is especially useful for games that begin in packed or highly populated initial conditions where you don't want every cell to die immediately from overpopulation.

## License

dat-life is released under the MIT license.

See the [license file](LICENSE.txt) for the full license text.
