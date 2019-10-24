import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr';
import * as Mustache from 'Mustache';

const access = promisify(fs.access);

async function copyTemplateFiles(templateDir, targetDirectory) {
  return copy(templateDir, targetDirectory, {
    clobber: false,
  });
}

function formatName(name) {
  const fileName = name.replace(/\s{1,}/g,'-').toLowerCase();
  console.log(fileName);
  const className = toCamleCase(fileName);
  const variableName = className.charAt(0).toLowerCase() + className.substring(1);
  return {
    className,
    fileName,
    variableName
  }
}

function toCamleCase(str) {
  const splitStr = str.toLowerCase().split('-');
  for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(''); 
}

async function createFilesFolder(path) {
  console.log(path)
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
    return;
  }
  console.error('%s Name already exists in the specified path', chalk.red.bold('Abort:'));
  process.exit(1);
}

function getContentFromFile(fileName) {
  return new Promise(function(resolve, reject){
    fs.readFile(fileName, 'utf8', (err, data) => {
        err ? reject(err) : resolve(data);
    });
  });
}

async function saveFile(path, content) {
  fs.writeFile(path, content, function(err) {
    if(err) {
        return console.log(err);
    }
  }); 
}

async function generateLitFiles(templateDir, targetDir, nameValues) {
  const newElementTemplate = await getContentFromFile(templateDir + '/new-element.js');
  const indexjsTemplate = await getContentFromFile(templateDir + '/index.js');
  const newElementTestTemplate = await getContentFromFile(templateDir + '/new-element.test.js');

  const litElementContent = await renderFileWithNames(newElementTemplate, nameValues);
  const indexjsContent = await renderFileWithNames(indexjsTemplate, nameValues);
  const newElementTestContent = await renderFileWithNames(newElementTestTemplate, nameValues);

  saveFile(targetDir + '/' + nameValues.fileName + '.js', litElementContent);
  saveFile(targetDir + '/index.js', indexjsContent);
  saveFile(targetDir + '/' + nameValues.fileName + '.test.js', newElementTestContent);
}

async function renderFileWithNames(template, nameValues) {
  return Mustache.render(template, nameValues);
}

export async function generateElement(options) {
  const LIT_VERSION = '0.5.2'
  const currentFileUrl = import.meta.url;
  const targetDirectory =  options.targetDirectory || process.cwd();

  const templateDir = path.resolve(new URL(currentFileUrl).pathname, '../../templates/', LIT_VERSION);

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const nameValues = formatName(options.name);

  const tasks = new Listr([
    {
      title: 'Create element directory',
      task: () => createFilesFolder(targetDirectory + '/' + nameValues.fileName),
    },
    {
      title: 'Create lit element',
      task: () => generateLitFiles(templateDir, targetDirectory + '/' + nameValues.fileName, nameValues),
    },
  ])

  await tasks.run();

  console.log('%s Element is ready', chalk.green.bold('DONE'));
  return true;
}
