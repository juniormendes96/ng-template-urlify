const { Project, QuoteKind } = require('ts-morph');

const extractTemplate = (templateUrl, fileContent) => {
  if (!fileContent) return null;

  const project = new Project();
  const sourceFile = project.createSourceFile('tmp/component.ts', fileContent, { overwrite: true });
  const componentDecorator = sourceFile
    .getClasses()
    .map((classDeclaration) => classDeclaration.getDecorator('Component'))
    .filter((decorator) => !!decorator)[0];

  if (!componentDecorator) return null;

  const decoratorProperties = componentDecorator.getArguments()[0]?.getProperties();
  const templateProperty = decoratorProperties?.find((property) => property.getName() === 'template');

  if (!templateProperty) return null;

  project.manipulationSettings.set({ quoteKind: getQuoteKind(sourceFile) });

  const templateContent = templateProperty.getInitializer().getText();

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
  const lines = template.split('\n');

  if (lines.length === 1) {
    const templateWithoutFirstAndLastQuotes = lines[0].slice(1, -1);
    return templateWithoutFirstAndLastQuotes;
  }

  const linesWithoutFirstAndLastBackticks = lines.slice(1, -1);
  const firstLineWithContent = linesWithoutFirstAndLastBackticks.find((line) => !!line.trim());
  const indentationSpaces = firstLineWithContent.match(/^\s*/)[0];

  return linesWithoutFirstAndLastBackticks.map((line) => line.replace(indentationSpaces, '')).join('\n');
};

module.exports = extractTemplate;
