import { Life } from "../src/index";
import { expect } from 'chai';

describe('life', () => {
    describe('board manipulation', () => {
        it('can create a board', () => {
            const life = new Life();
            expect(life.getWidth()).to.eql(100);
            expect(life.getHeight()).to.eql(100);
        });
        it('can create a board with custom size', () => {
            const life = new Life(500, 500);
            expect(life.getWidth()).to.eql(500);
            expect(life.getHeight()).to.eql(500);
        });
        it('can change a board size', () => {
            const life = new Life(100, 100);
            expect(life.getWidth()).to.eql(100);
            expect(life.getHeight()).to.eql(100);

            life.setWidth(42);
            life.setHeight(42);
            expect(life.getWidth()).to.eql(42);
            expect(life.getHeight()).to.eql(42);
        });
        it('can set a state given a coordinate', () => {
            const life = new Life();
            life.set(42, 42, 1);
            expect(life.get(2, 2)).to.eql(0);
            expect(life.get(42, 42)).to.eql(1);
            expect(life.get(99, 99)).to.eql(0);
        });
        it('can clear board', () => {
            const life = new Life();
            life.set(42, 42, 1);
            expect(life.get(42, 42)).to.eql(1);
            life.clear();
            expect(life.get(42, 42)).to.eql(0);
        });
        it('resizing clears board', () => {
            const life = new Life();
            life.set(42, 42, 1);
            expect(life.get(42, 42)).to.eql(1);
            life.setWidth(100);
            expect(life.get(42, 42)).to.eql(0);
        });
        it('can randomize board 🤞', () => {
            const life = new Life();
            let nonzero = false;

            // Hopefully at least one cell was randomly nonzero 🤞
            life.randomize();
            life.visit((x: number, y: number) => {
                if (life.get(x, y) != 0) {
                    nonzero = true;
                }
            });
            expect(nonzero).to.eql(true);
        });
        it('can create board from input', () => {
            const life = new Life(4, 4);
            life.setBoard([
                1, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 1,
            ]);
            expect(life.get(0, 0)).to.eql(1);
            expect(life.get(0, 1)).to.eql(0);
            expect(life.get(0, 2)).to.eql(0);
            expect(life.get(0, 3)).to.eql(0);
            expect(life.get(1, 0)).to.eql(0);
            expect(life.get(1, 1)).to.eql(1);
            expect(life.get(1, 2)).to.eql(1);
            expect(life.get(1, 3)).to.eql(0);
            expect(life.get(2, 0)).to.eql(0);
            expect(life.get(2, 1)).to.eql(1);
            expect(life.get(2, 2)).to.eql(1);
            expect(life.get(2, 3)).to.eql(0);
            expect(life.get(3, 0)).to.eql(0);
            expect(life.get(3, 1)).to.eql(0);
            expect(life.get(3, 2)).to.eql(0);
            expect(life.get(3, 3)).to.eql(1);
        });
        it('cannot create board from inconsistent arrays', () => {
            expect(() => {
                const life = new Life(4, 4);
                life.setBoard([
                    0, 1, 1, 0,
                    0, 1, 1,
                ]);
            }).to.throw();
        });
    });
    describe('standard gameplay', () => {
        it('can get the next step', () => {
            const life = new Life(7, 5);
            life.setBoard([
                0, 0, 0, 0, 0, 0, 0,
                0, 1, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0,
                1, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
            ]);

            console.log(`oy oy oy oy oy oy oy`);

            const foo = life.next();
            console.log(`ahhh ${foo.length}`);
            expect(life.getBoard()).to.eql([
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                1, 0, 1, 0, 0, 0, 0,
                0, 1, 1, 0, 0, 0, 0,
                0, 1, 0, 0, 0, 0, 0,
            ]);

            console.log(`yo yo yo yo yo yo yo`);

            life.next();
            expect(life.getBoard()).to.eql([
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0,
                1, 0, 1, 0, 0, 0, 0,
                0, 1, 1, 0, 0, 0, 0,
            ]);
        });
        it('can get the generation number', () => {
            const life = new Life();
            expect(life.getGeneration()).to.eql(1);

            life.next();
            expect(life.getGeneration()).to.eql(2);

            life.next();
            expect(life.getGeneration()).to.eql(3);
        });
        it('can get the population count', () => {
            const life = new Life(8, 4);
            life.setBoard([
                1, 1, 0, 1, 0, 1, 1, 1,
                1, 0, 0, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1,
                0, 1, 1, 0, 0, 0, 1, 1,
            ]);

            expect(life.getPopulation()).to.eql(22);

            life.next();
            expect(life.getBoard()).to.eql([
                1, 1, 1, 1, 0, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 0, 0,
                1, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 1, 1, 0, 1, 1, 1,
            ]);

            expect(life.getPopulation()).to.eql(13);
        });
    });
    describe('colors', () => {
        it('can round-trip two colors', () => {
            const one = new Life();
            one.setColors(2);
            one.randomize();

            const two = new Life();
            two.setColors(2);
            two.setBoard(one.getBoard());

            expect(one.getBoard()).to.eql(two.getBoard());
        });
        it('can round-trip two colors', () => {
            const one = new Life();
            one.setColors(4);
            one.randomize();

            const two = new Life();
            two.setColors(4);
            two.setBoard(one.getBoard());

            expect(one.getBoard()).to.eql(two.getBoard());
        });
        it('two colors are based on majority of neighbors', () => {
            const life = new Life(6, 6);
            life.setColors(2);
            life.setBoard([
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 1, 0,
                0, 2, 2, 2, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ]);
            expect(life.next()).to.eql([
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0,
                0, 2, 0, 0, 1, 0,
                0, 2, 0, 0, 1, 0,
                0, 0, 2, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ]);
        });
        it('four colors are based on majority of neighbors', () => {
            const life = new Life(6, 6);
            life.setColors(4);
            life.setBoard([
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 2, 3, 4, 0,
                0, 4, 2, 3, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ]);
            expect(life.next()).to.eql([
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0,
                0, 2, 0, 0, 4, 0,
                0, 4, 0, 0, 3, 0,
                0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ]);
        });
    });
    describe('patterns', () => {
        it('block is still life', () => {
            const block = [
                0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0,
            ];

            const life = new Life(4, 4);
            life.setBoard(block);
            expect(life.next()).to.eql(block);
        });
        it('blinker oscillates', () => {
            const blinker1 = [
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0,
            ];
            const blinker2 = [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
            ];

            const life = new Life(5, 5);
            life.setBoard(blinker1);
            expect(life.next()).to.eql(blinker2);
            expect(life.next()).to.eql(blinker1);
            expect(life.next()).to.eql(blinker2);
        });
        it('toad oscillates', () => {
            const toad1 = [
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 1, 0,
                0, 1, 1, 1, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ];
            const toad2 = [
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0,
                0, 1, 0, 0, 1, 0,
                0, 1, 0, 0, 1, 0,
                0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ];

            const life = new Life(6, 6);
            life.setBoard(toad1);
            expect(life.next()).to.eql(toad2);
            expect(life.next()).to.eql(toad1);
            expect(life.next()).to.eql(toad2);
        });
        it('beacon oscillates', () => {
            const beacon1 = [
                0, 0, 0, 0, 0, 0,
                0, 1, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 0,
                0, 0, 0, 1, 1, 0,
                0, 0, 0, 0, 0, 0,
            ];
            const beacon2 = [
                0, 0, 0, 0, 0, 0,
                0, 1, 1, 0, 0, 0,
                0, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 0,
                0, 0, 0, 1, 1, 0,
                0, 0, 0, 0, 0, 0,
            ];

            const life = new Life(6, 6);
            life.setBoard(beacon1);
            expect(life.next()).to.eql(beacon2);
            expect(life.next()).to.eql(beacon1);
            expect(life.next()).to.eql(beacon2);
        });
        it('pulsar oscillates', () => {
            const pulsar1 = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ];
            const pulsar2 = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0,
                0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ];
            const pulsar3 = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0,
                0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0,
                0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0,
                0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ];
            const life = new Life(17, 17);
            life.setBoard(pulsar1);
            expect(life.next()).to.eql(pulsar2);
            expect(life.next()).to.eql(pulsar3);
            expect(life.next()).to.eql(pulsar1);
        });
    });
});
