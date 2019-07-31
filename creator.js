const child_process = require('child_process');
const chalk = require('chalk');
const log = console.log;
const fs = require('fs');

const folderCreator = (modelName, isFirst, schema) => {
    try {
        // creating necessairy folders
        if (isFirst) {
            const folderCommand = 'cd ./src && mkdir dto interfaces schemas externals models';
            child_process.execSync(folderCommand, {
                stdio: 'inherit'
            });
        }

        // creating necessairy files
        const fileCommand = 'touch ./src/dto/' + modelName + '.dto.ts  ./src/interfaces/' + modelName + '.interface.ts ./src/schemas/' + modelName + '.schema.ts';
        child_process.execSync(fileCommand, {
            stdio: 'inherit'
        });

        setTimeout(() => {
            if (schema !== null) {
                schemaCreator(schema, modelName);
                interfaceCreator(schema, modelName);
            }
        }, 250);


        // create module commande
        const modelCommand = 'nest g mo ./' + modelName + ' models';
        child_process.execSync(modelCommand, {
            stdio: 'inherit'
        });
        // create controller  commande
        const controllerCommand = 'nest g co ./' + modelName + ' models';
        child_process.execSync(controllerCommand, {
            stdio: 'inherit'
        });
        // create service commande
        const serviceCommand = 'nest g service ./' + modelName + ' models';
        child_process.execSync(serviceCommand, {
            stdio: 'inherit'
        });

        const message = isFirst ? 'Your module and service sub folder has been created successfully' : 'Your module has been created successfully';
        log(chalk.blue(message))
    } catch (err) {
        console.error(err)
    }
}

const schemaCreator = (schema, modelName) => {

    let output = '';
    for (let property in schema) {
        log(schema[property]);
        output += property + ': { type:' + schema[property].type + '}, ';
    }
    const content = `import * as mongoose from '@nestjs/mongoose'
    export const ${modelName}Schema = new mongoose.Schema({${output}}) `;

    fs.appendFile(`./src/schemas/${modelName}.schema.ts`, content, function (err) {
        if (err) {
            log(chalk.red(err))
        } else {
            log(chalk.green('Schema Created!'))
        };
    });
}

const interfaceCreator = (schema, modelName) => {

    let output = '';
    for (let property in schema) {
        log(schema[property]);
        output += 'readonly ' + property + ': ' + schema[property].type.toString().toLowerCase() + '; ';
    }
    const content = `import * as mongoose from '@nestjs/mongoose'
    export interface ${capitalize(modelName)} extends mongoose.Document{${output}} `;
    log(content);
    fs.appendFile(`./src/interfaces/${modelName}.interface.ts`, content, function (err) {
        if (err) {
            log(chalk.red(err))
        } else {
            log(chalk.green('Interface Created!'))
        };
    });
}

const capitalize = (name) => {
    if (typeof name !== 'string') return ''
    return name.charAt(0).toUpperCase() + name.slice(1)
}
module.exports = {
    folderCreator
}