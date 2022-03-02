#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const scan = require('recursive-readdir-sync');
const commandLineArgs = require('command-line-args');
const beautify = require('js-beautify').html;

const options = commandLineArgs([{ name: 'targets', type: String, multiple: true, defaultOption: true }]);

const src = path.join(path.dirname(fs.realpathSync(__filename)), '../src');

const extractComponentDecorator = require(`${src}/extract-component-decorator`);
const extractDecoratorTemplate = require(`${src}/extract-decorator-template`);

const targets = options.targets
  .reduce((targets, target) => {
    if (fs.statSync(target).isDirectory()) {
      return [...targets, ...scan(target)];
    }
    return [...targets, target];
  }, [])
  .filter((target) => target.endsWith('.ts'));

if (!targets.length) {
  return console.info('No ts files found');
}

console.info(`${targets.length} ts files found. Starting to process...`);

let convertedFilesQuantity = 0;

targets.forEach((target) => {
  const input = fs.readFileSync(target, 'utf-8');
  const decorator = extractComponentDecorator(input);
  const template = extractDecoratorTemplate(decorator);

  if (!template) return;

  const { raw, content } = template;
  const htmlFilePath = target.replace('.ts', '.html');
  const htmlFileName = htmlFilePath.split('/').find((file) => file.endsWith('.html'));
  const replacedTarget = input.replace(raw, `templateUrl: "${htmlFileName}"`);

  fs.writeFileSync(target, replacedTarget, 'utf-8');
  fs.writeFileSync(htmlFilePath, beautify(content));

  convertedFilesQuantity++;
});

console.info(`Process finished. ${convertedFilesQuantity} files have been converted`);
