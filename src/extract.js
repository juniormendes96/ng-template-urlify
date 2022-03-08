const { Project, QuoteKind } = require('ts-morph');

const extract = (templateUrl, fileContent) => {
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
  const lines = template.split('\n').filter((line) => !isBacktickLine(line));
  const isSingleLine = lines.length === 1;

  if (isSingleLine) {
    const templateWithoutQuotes = lines[0].slice(1, -1);
    return templateWithoutQuotes;
  }

  const indentationSpaces = lines[0].match(/^\s*/)[0];
  return lines.map((line) => line.replace(indentationSpaces, '')).join('\n');
};

const isBacktickLine = (line) => line.replaceAll(' ', '') === '`';

module.exports = extract;
