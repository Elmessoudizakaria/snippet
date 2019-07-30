const child_process = require('child_process');
const chalk = require('chalk');
const log = console.log;

const folderCreator = (modelName, isFirst) => {
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

        log(chalk.green('Model and sub folders created'))
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    folderCreator
}