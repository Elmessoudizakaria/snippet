#!/usr/bin/env node

const program = require('commander');
const {
    prompt
} = require('inquirer');

const {
    folderCreator
} = require('./creator');

const questions = [{
        type: 'input',
        name: 'model',
        message: 'Model name'
    },
    {
        type: 'confirm',
        name: 'isFirst',
        message: 'Model name'
    }
];

program.version('1.0.0').description('MicroService Creator');

program
    .command('add')
    .alias('a')
    .description('add model')
    .action(() => {
        prompt(questions).then(answers => folderCreator(answers.model, answers.isFirst));
    });

program.parse(process.argv);