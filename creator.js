const child_process = require('child_process');
const chalk = require('chalk');
const log = console.log;
const fs = require('fs');

const folderCreator = (modelName, isFirst, schema) => {
    try {
        // creating necessairy folders
        if (isFirst) {
            const folderCommand = 'cd ./src && mkdir dto interfaces schemas externals models repositories shared';
            child_process.execSync(folderCommand, {
                stdio: 'inherit'
            });
        }

        // creating necessairy files
        const fileCommand = 'touch ./src/dto/' + modelName + '.dto.ts  ./src/interfaces/' + modelName + '.interface.ts ' +
            './src/schemas/' + modelName + '.schema.ts ./src/repositories/' + modelName + '.repository.ts';
        child_process.execSync(fileCommand, {
            stdio: 'inherit'
        });

        setTimeout(() => {
            if (schema !== null) {
                schemaCreator(schema, modelName);
                interfaceCreator(schema, modelName);
                repoCreator(modelName);
                appModuleModifier(modelName);
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
        output += property + ': { type: ' + schema[property].type + '},\n';
    }
    const content = `import * as mongoose from 'mongoose';
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
        const propTYpe = schema[property].type.toString() !== 'Date' ?
            schema[property].type.toString().toLowerCase() :
            schema[property].type.toString();
        output += 'readonly ' + property + ': ' + propTYpe + ';\n';
    }
    const content = `import * as mongoose from 'mongoose';
    export interface ${capitalize(modelName)} extends mongoose.Document{${output}} `;
    fs.appendFile(`./src/interfaces/${modelName}.interface.ts`, content, function (err) {
        if (err) {
            log(chalk.red(err))
        } else {
            log(chalk.green('Interface Created!'))
        };
    });
}

const repoCreator = (modelName) => {

    const content = `
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ${capitalize(modelName)} } from '../interfaces/${modelName}.interface';

@Injectable()
export class ${capitalize(modelName)}Repository {
constructor(@InjectModel('${capitalize(modelName)}') private readonly model: Model<${capitalize(modelName)}>) {}

async findAll():Promise<${capitalize(modelName)}[]>{
    return await this.model.find();
}
async findById(id:string):Promise<${capitalize(modelName)}>{
    return await this.model.findById(id);
}

}
    `;
    fs.appendFile(`./src/repositories/${modelName}.repository.ts`, content, function (err) {
        if (err) {
            log(chalk.red(err))
        } else {
            log(chalk.green('Repository Created!'))
        };
    });
}


const appModuleModifier = (modelName) => {
    const content = `
import { Module } from '@nestjs/common';
import { ${capitalize(modelName)}Controller } from './${modelName}.controller';
import { ${capitalize(modelName)}Service } from './${modelName}.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ${modelName}Schema } from '../../schemas/${modelName}.schema';
import { ${capitalize(modelName)}Repository } from '../../repositories/${modelName}.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: '${capitalize(modelName)}', schema: ${modelName}Schema }]),
  ],
  controllers: [${capitalize(modelName)}Controller],
  providers: [${capitalize(modelName)}Service, ${capitalize(modelName)}Repository],
})
export class ${capitalize(modelName)}Module {}

    `;
    try {
        fs.writeFileSync(`./src/models/${modelName}/${modelName}.module.ts`, content);
    } catch (error) {
        console.log(error);
    }
}
const capitalize = (name) => {
    if (typeof name !== 'string') return ''
    return name.charAt(0).toUpperCase() + name.slice(1)
}
module.exports = {
    folderCreator
}