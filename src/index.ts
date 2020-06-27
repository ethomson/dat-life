export class Life {
    private width: number;
    private height: number;
    private colors: number;

    private board: number[];
    private generation: number;
    private population: number;

    constructor(width = 100, height = 100) {
        this.width = width;
        this.height = height;
        this.colors = 1;

        this.board = this.createBoard();
        this.generation = 1;
        this.population = 0;

        this.reset();
    }

    setWidth(width: number) {
        this.width = width;
        this.board = this.createBoard();
        this.reset();
    }

    setHeight(height: number) {
        this.height = height;
        this.board = this.createBoard();
        this.reset();
    }

    setColors(colors: number) {
        if (colors != 1 && colors != 2 && colors != 4) {
            throw new Error("invalid number of colors");
        }

        this.colors = colors;
        this.reset();
    }

    getWidth(): number { return this.width; }
    getHeight(): number { return this.height; }
    getColors(): number { return this.colors; }

    private createBoard(): number[] {
        return new Array(this.width * this.height);
    }

    visit(visitor: (x: number, y: number) => void) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                visitor(x, y);
            }
        }
    }

    private index(x: number, y: number): number {
        return x + (this.width * y);
    }

    private reset() {
        this.visit((x: number, y: number) => { this.board[this.index(x, y)] = 0 });
        this.generation = 1;
        this.population = 0;
    }

    public clear(): number[] {
        this.reset();
        return this.getBoard();
    }

    set(x: number, y: number, state: number) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            throw new Error("array index is out of bounds");
        }

        if (state < 0 || state > this.colors) {
            throw new Error("invalid state");
        }

        if (state) {
            this.population++;
        }

        this.board[this.index(x, y)] = state;
    }

    get(x: number, y: number): number {
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            throw new Error("array index is out of bounds");
        }

        return this.board[this.index(x, y)];
    }

    public setBoard(board: number[]) {
        if (board.length != this.width * this.height) {
            throw new Error('array values do not match dimensions');
        }

        this.reset();
        this.board = board.slice();
        this.board.forEach((state: number) => {
            if (state > this.colors) {
                throw new Error('state value out of range');
            }
            else if (state) {
                this.population++;
            }
        });
    }
    
    getBoard(): number[] {
        return this.board.slice();
    }

    getPopulation(): number {
        return this.population;
    }

    getGeneration(): number {
        return this.generation;
    }

    randomize(): number[] {
        this.population = 0;

        this.visit((x: number, y: number) => {
            // 1 in 4 whether a cell is alive; if it is, it has a random color
            const alive = Math.floor(Math.random() * 4) === 0;
            const color = Math.floor(Math.random() * this.colors) + 1;
            const state = alive ? color : 0;

            if (state) {
                this.population++;
            }

            this.board[this.index(x, y)] = state;
        });

        return this.getBoard();
    }

    // returns a one-dimensional array selecting the neighbors around a cell
    private neighbors(x: number, y: number): number[] {
        const neighbors = new Array(8);

        neighbors[0] = (x > 0 && y > 0) ? this.get(x - 1, y - 1) : 0;
        neighbors[1] = (x > 0) ? this.get(x - 1, y) : 0;
        neighbors[2] = (x > 0 && y < this.height - 1) ? this.get(x - 1, y + 1) : 0;

        neighbors[3] = (y > 0) ? this.get(x, y - 1) : 0;
        neighbors[4] = (y < this.height - 1) ? this.get(x, y + 1) : 0;

        neighbors[5] = (x < this.width - 1 && y > 0) ? this.get(x + 1, y - 1) : 0;
        neighbors[6] = (x < this.width - 1) ? this.get(x + 1, y) : 0;
        neighbors[7] = (x < this.width - 1 && y < this.height - 1) ? this.get(x + 1, y + 1) : 0;

        return neighbors;
    }

    private getColor(neighbors: number[]) {
        switch (this.colors) {
            case 1:
                return 1;

            // two colors: newborns are the majority color of the parents
            case 2: {
                const count: number[] = [ 0, 0 ];

                for (let color of neighbors) {
                    if (color && ++count[color - 1] == 2) {
                        return color;
                    }
                }

                break;
            }

            // four colors: newborns are the majority color of the parents if
            // there is a majority; otherwise its the fourth color (the color
            // that no parent has)
            case 4: {
                const count: number[] = [ 0, 0, 0, 0 ];

                for (let color of neighbors) {
                    if (color && ++count[color - 1] == 2) {
                        return color;
                    }
                }

                return count.findIndex((x) => { return x === 0 }) + 1;
            }
        }

        throw new Error('unsolved color');
    }

    next(): number[] {
        const next = this.createBoard();

        this.population = 0;

        this.visit((x: number, y: number) => {
            const idx = this.index(x, y);
            const alive = this.board[idx] !== 0;
            const neighbors = this.neighbors(x, y);

            const count = neighbors.filter((x) => { return x !== 0 }).length;

            if (alive && count < 2) {
                next[idx] = 0; // exposure
            }
            else if (alive && count > 3) {
                next[idx] = 0; // overcrowding
            }
            else if (!alive && count === 3) {
                next[idx] = this.getColor(neighbors); // birth
            }
            else {
                next[idx] = this.board[idx];
            }

            if (next[idx]) {
                this.population++;
            }
        });

        this.board = next;

        this.generation++;
        return this.getBoard();
    }
}
