#!/usr/bin/env node

(() => {
  const path = require('path');
  const fs = require('fs');
  const scan = require('recursive-readdir-sync');

  const [, , ...targets] = process.argv;

  const extractTemplate = require(path.join(path.dirname(fs.realpathSync(__filename)), '../src/extract-template'));

  if (!targets?.length) {
    return console.error('You have to provide a path to the TS files.');
  }

  const tsFilePaths = targets
    .reduce((paths, path) => (fs.statSync(path).isDirectory() ? [...paths, ...scan(path)] : [...paths, path]), [])
    .filter((target) => target.endsWith('.ts'));

  if (!tsFilePaths.length) {
    return console.info('No TS files found.');
  }

  let convertedFilesQuantity = 0;

  tsFilePaths.forEach((path) => {
    const fileContent = fs.readFileSync(path, 'utf-8');
    const fileName = path.split('/').at(-1);
    const templateUrl = `./${fileName.replace('.ts', '.html')}`;
    const result = extractTemplate(templateUrl, fileContent);

    if (!result || !result.templateHtml?.trim()) {
      return console.info(`No inline template found on ${fileName}`);
    }

    console.info(`Inline template found on ${fileName}`);

    const { templateHtml, component } = result;
    const htmlFilePath = path.replace('.ts', '.html');

    fs.writeFileSync(path, component, 'utf-8');
    fs.writeFileSync(htmlFilePath, templateHtml, 'utf-8');

    convertedFilesQuantity++;
  });

  console.info(
    `Process finished! ${convertedFilesQuantity} out of ${tsFilePaths.length} TS files have been converted.`
  );
})();
