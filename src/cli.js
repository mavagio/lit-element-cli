import arg from 'arg';
import inquirer from 'inquirer';
import {generateElement} from './lit-element-generator';
import chalk from 'chalk';

function parseArgumentsIntoOptions(rawArgs) {
  let args;
  try {
    args = arg(
      {
        '--generate': String,
        '-g': '--generate',
      },
      {
        argv: rawArgs.slice(2),
      }
    );
  } catch(err) {
    console.error(err);
    console.error('%s Invalid arguments', chalk.red.bold('ERROR:'));
    process.exit(1); 
  }
  return {
    name: args['--generate'] || false,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  await generateElement(options);
}