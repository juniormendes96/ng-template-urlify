#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const scan = require('recursive-readdir-sync');
const commandLineArgs = require('command-line-args');
const beautify = require('js-beautify').html;

const src = path.join(path.dirname(fs.realpathSync(__filename)), '../src/extract');
const options = commandLineArgs([{ name: 'targets', type: String, multiple: true, defaultOption: true }]);

const extract = require(src);

const targets = [];

options.targets.forEach((target) => {
  if (fs.statSync(target).isDirectory()) {
    targets.push.apply(targets, scan(target));
  } else {
    targets.push(target);
  }
});

targets
  .filter((target) => target.endsWith('.ts'))
  .forEach((target) => {
    const input = fs.readFileSync(target, 'utf-8');
    const result = extract(input);

    if (result && result !== {}) {
      const { rawTemplate, templateContent } = result;
      const htmlFilePath = target.replace('.ts', '.html');
      const htmlFileName = htmlFilePath.split('/').find((file) => file.endsWith('.html'));
      const replacedTarget = input.replace(rawTemplate, `templateUrl: "${htmlFileName}"`);

      fs.writeFileSync(target, replacedTarget, 'utf-8');
      fs.writeFileSync(htmlFilePath, beautify(templateContent));
    }
  });
