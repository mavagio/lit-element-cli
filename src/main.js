import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function createFolder(path) {
  if (!fs.existsSync(path)){
      fs.mkdirSync(path);
      return;
  }
  console.error('%s Name already exists in the specified path', chalk.red.bold('Abort:'));
  process.exit(1);
}

async function initGit(options) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  });

  if(result.failed) {
    return Promise.reject(new Error('Failed to initialize Git'));
  }
  return;
}

export async function createProject(options) {
  options  = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates/0.5.2');
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }
  const elementName = options.name

  await copyTemplateFiles(options);
  const tasks = new Listr([
    {
      title: 'Create element directory',
      task: () => createFolder('./' + elementName),
    },
    {
      title: 'Generate template files',
      task: () => copyTemplateFiles(options),
    },
  ])

  await tasks.run();

  console.log('%s Element is ready', chalk.green.bold('DONE'));
  return true;
}
