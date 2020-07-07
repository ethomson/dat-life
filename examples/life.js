#!/usr/bin/env node

const clear = require('clear');
const chalk = require('chalk');
const { Life } = require('../lib/index.js');

const utf8 = true;

const width = (process.stdout.columns || 80);
const height = (process.stdout.rows || 24) - 1;

const life = new Life(width, height);
let delay = 500;

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--2') {
        life.setColors(2);
    }
    else if (process.argv[i] === '--4') {
        life.setColors(4);
    }
    else if (process.argv[i] === '--decay') {
        life.setDecay(true);
    }
    else if (process.argv[i] === '--delay') {
        if (i + 1 == process.argv.length) {
            console.error(`argument expected, usage: --delay <ms>`);
            process.exit(1);
        }

        delay = process.argv[++i];

        if (!delay.match(/^\d+$/)) {
            console.error(`argument expected, usage: --delay <ms>`);
            process.exit(1);
        }
    }
    else {
        console.error(`unknown argument: ${process.argv[i]}`);
        process.exit(1);
    }
}

life.randomize();

draw(life);

function draw(life) {
    clear();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            switch (life.get(x, y)) {
                case 0:
                    process.stdout.write(chalk.grey(utf8 ? '▢' : ' '));
                    break;
                case 1:
                    process.stdout.write(chalk.whiteBright(utf8 ? '▣' : '*'));
                    break;
                case 2:
                    process.stdout.write(chalk.cyanBright(utf8 ? '▣' : 'x'));
                    break;
                case 3:
                    process.stdout.write(chalk.magentaBright(utf8 ? '▣' : '+'));
                    break;
                case 4:
                    process.stdout.write(chalk.greenBright(utf8 ? '▣' : '#'));
                    break;
            }
        }

        process.stdout.write('\n');
    }

    process.stdout.write(`Generation: ${life.getGeneration()} / Population: ${life.getPopulation()}`); 

    life.next();
    setTimeout(draw, delay, life);
}
