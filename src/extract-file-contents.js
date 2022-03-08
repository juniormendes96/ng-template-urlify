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

  project.manipulationSettings.set({ quoteKind: getQuoteKind(sourceFile) });

  const templateContent = templateProperty.getInitializer().getLiteralValue();

  templateProperty.set({ name: 'templateUrl', initializer: (writer) => writer.quote(templateUrl) });

  return {
    templateHtml: removeUnnecessaryTemplateChars(templateContent),
    component: sourceFile.getFullText(),
  };
};

const getQuoteKind = (sourceFile) => {
  const defaultKind = QuoteKind.Double;

  try {
    return sourceFile.getImportDeclarations()[0]?.getModuleSpecifier()?.getQuoteKind() || defaultKind;
  } catch (err) {
    return defaultKind;
  }
};

const removeUnnecessaryTemplateChars = (template) => {
  const lines = extractLines(template);

  if (!lines.length) {
    return '';
  }

  if (lines.length === 1) {
    return lines[0];
  }

  const firstLineWithContent = lines.find((line) => !!line.trim());
  const indentationSpaces = firstLineWithContent.match(/^\s*/)[0];

  return lines.map((line) => line.replace(indentationSpaces, '')).join('\n');
};

const extractLines = (template) => template.split('\n').filter((line, index) => index > 0 || !!line.trim());

module.exports = extractFileContents;
