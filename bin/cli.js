#!/usr/bin/env node

(() => {
  const path = require('path');
  const fs = require('fs');
  const scan = require('recursive-readdir-sync');
  const commandLineArgs = require('command-line-args');

  const options = commandLineArgs([{ name: 'targets', type: String, multiple: true, defaultOption: true }]);

  const extract = require(path.join(path.dirname(fs.realpathSync(__filename)), '../src/extract-file-contents'));

  if (!options.targets) {
    return console.error('You have to provide the path to your files.');
  }

  const tsTargets = options.targets
    .reduce((targets, target) => {
      if (fs.statSync(target).isDirectory()) {
        return [...targets, ...scan(target)];
      }
      return [...targets, target];
    }, [])
    .filter((target) => target.endsWith('.ts'));

  if (!tsTargets.length) {
    return console.info('No ts files found.');
  }

  console.info(`${tsTargets.length} ts files found. Starting to process...`);

  let convertedFilesQuantity = 0;

  tsTargets.forEach((path) => {
    const fileContent = fs.readFileSync(path, 'utf-8');
    const htmlFilePath = path.replace('.ts', '.html');
    const templateUrl = `./${htmlFilePath.split('/').find((t) => t.endsWith('.html'))}`;
    const result = extract(templateUrl, fileContent);

    if (!result) return;

    const { templateHtml, component } = result;

    fs.writeFileSync(path, component, 'utf-8');
    fs.writeFileSync(htmlFilePath, templateHtml, 'utf-8');

    convertedFilesQuantity++;
  });

  console.info(`Process finished! ${convertedFilesQuantity} files have been converted.`);
})();
