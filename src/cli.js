import arg from 'arg';
import inquirer from 'inquirer';
import {createProject} from './main';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--no': Boolean,
      '--generate': Boolean,
      '-g': '--generate',
      '-y': '--yes',
      '-n': '--no',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    generate: args['--generate'] || false,
  }
}

function validateOptions(options) {
  console.log(options);
}

async function promptForMissingOptions(options) {
  const defaultName = 'new-element';

  const questions = [];
  if(!options.version) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'Please give a name to new element',
      default: 'new-element',
    })
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    name: options.name || answers.name,
    git: options.git || answers.git,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  validateOptions(options);
  options =  await promptForMissingOptions(options);
  await createProject(options);
}