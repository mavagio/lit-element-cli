import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import Listr from 'listr';
import * as Mustache from 'Mustache';

const FILE_URL = import.meta.url;
const LIT_VERSION = '0.5.2';

function formatName(name) {
  const fileName = name.replace(/\s{1,}/g,'-').toLowerCase();
  console.log(fileName);
  const className = toCamleCase(fileName);
  const variableName = className.charAt(0).toLowerCase() + className.substring(1);
  return { className, fileName, variableName };
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
  saveFileBasedOnTemplate(templateDir, targetDir, nameValues, 'index.js', 'index.js');
  saveFileBasedOnTemplate(templateDir, targetDir, nameValues, 'new-element.js', nameValues.fileName);
  saveFileBasedOnTemplate(templateDir, targetDir, nameValues, 'new-element.test.js', nameValues.fileName + '.test');
}

async function saveFileBasedOnTemplate(templateDir, targetDir, nameValues, templateName, finalName) {
  const template = await getContentFromFile(templateDir + '/' + templateName);
  const content = await renderFileWithNames(template, nameValues);
  saveFile(targetDir + '/' + finalName + '.js', content);
}

async function renderFileWithNames(template, nameValues) {
  return Mustache.render(template, nameValues);
}

export async function generateElement(options) {
  const targetDirectory =  options.targetDirectory || process.cwd();
  const templateDir = path.resolve(new URL(FILE_URL).pathname, '../../templates/', LIT_VERSION);
  const nameValues = formatName(options.name);

  const tasks = new Listr([
    {
      title: 'Create element directory',
      task: () => createFilesFolder(targetDirectory + '/' + nameValues.fileName),
    },
    {
      title: 'Create lit element files',
      task: () => generateLitFiles(templateDir, targetDirectory + '/' + nameValues.fileName, nameValues),
    },
  ])

  await tasks.run();

  console.log('%s Element is ready', chalk.green.bold('DONE'));
  return true;
}
