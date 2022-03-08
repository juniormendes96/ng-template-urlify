const { Project, QuoteKind } = require('ts-morph');

const extractFileContents = (templateUrl, fileContent) => {
  if (!fileContent) return null;

  const project = new Project();
  const sourceFile = project.createSourceFile('tmp/component.ts', fileContent, { overwrite: true });
  const componentDecorator = sourceFile
    .getClasses()
    .map((component) => component.getDecorator('Component'))
    .filter((decorator) => !!decorator)[0];

  if (!componentDecorator) return null;

  const decoratorProperties = componentDecorator.getArguments()[0]?.getProperties();
  const templateProperty = decoratorProperties?.find((property) => property.getName() === 'template');

  if (!templateProperty) return null;

  const selectorProperty = decoratorProperties.find((p) => p.getName() === 'selector');
  const quoteKind = selectorProperty?.getInitializer()?.getQuoteKind() || QuoteKind.Double;

  project.manipulationSettings.set({ quoteKind });

  const templateContent = templateProperty.getInitializer().getText();

  templateProperty.set({ name: 'templateUrl', initializer: (writer) => writer.quote(templateUrl) });

  return {
    templateHtml: removeUnnecessaryTemplateChars(templateContent),
    component: sourceFile.getFullText(),
  };
};

const removeUnnecessaryTemplateChars = (template) => {
  const lines = template.split('\n');
  const isSingleLine = lines.length === 1;

  if (isSingleLine) {
    const templateWithoutQuotes = lines[0].slice(1, -1);
    return templateWithoutQuotes;
  }

  const linesWithoutBackticks = lines.filter((line) => line.replaceAll(' ', '') !== '`');
  const indentationSpaces = linesWithoutBackticks[0].match(/^\s*/)[0];

  return linesWithoutBackticks.map((line) => line.replace(indentationSpaces, '')).join('\n');
};

module.exports = extractFileContents;