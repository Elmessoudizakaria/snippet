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
    },
    {
        type: 'confirm',
        name: 'isAtts',
        message: 'Do you wanna add attributes to this module ?'
    }
];

const modelQuestion = [{
        type: 'input',
        name: 'atts',
        message: 'attribute name'
    },
    {
        type: 'list',
        name: 'attsType',
        choices: ['String', 'Number', 'Boolean']
    },
    {
        type: 'confirm',
        name: 'isMore',
        message: 'Do you wanna add more attributes to this module ?'
    }
]
let schema = {};

const addAttrs = (globalAnswers) => {
    prompt(modelQuestion).then(answers => {
        if (answers.isMore) {
            schema[answers.atts] = {
                type: answers.attsType
            };
            addAttrs(globalAnswers);
        } else {
            schema[answers.atts] = {
                type: answers.attsType
            };
            folderCreator(globalAnswers.model, globalAnswers.isFirst, schema)
        }
    });
}

program.version('1.0.0').description('MicroService Creator');

program
    .command('add')
    .alias('a')
    .description('add model')
    .action(() => {
        prompt(questions).then(answers => {
            if (answers.isAtts) {
                addAttrs(answers);
            } else {
                folderCreator(answers.model, answers.isFirst, null)
            }
        });
    })

program.parse(process.argv);