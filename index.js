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
        message: 'would you like to set the module name'
    },
    {
        type: 'confirm',
        name: 'isFirst',
        message: 'is it your first module'
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