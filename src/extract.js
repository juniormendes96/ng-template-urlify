const { Project, QuoteKind } = require('ts-morph');

function extract(templateUrl, fileContent) {
  if (!fileContent) return null;

  const project = new Project({ manipulationSettings: { quoteKind: QuoteKind.Double } });
  const sourceFile = project.createSourceFile('tmp/component.ts', fileContent, { overwrite: true });
  const decorator = (sourceFile.getClasses() || []).map((c) => c.getDecorator('Component')).filter((d) => !!d)[0];

  if (!decorator) return null;

  const templateProperty = decorator
    .getArguments()[0]
    .getProperties()
    .find((p) => p.getName() === 'template');

  if (!templateProperty) return null;

  const templateContent = templateProperty.getInitializer().getText();

  templateProperty.set({ name: 'templateUrl', initializer: (writer) => writer.quote(templateUrl) });

  return {
    templateHtml: removeUnnecessaryTemplateChars(templateContent),
    component: sourceFile.getFullText(),
  };
}

function removeUnnecessaryTemplateChars(template) {
  const lines = template.split('\n').filter((line) => !line.includes('`'));
  const isSingleLine = lines.length === 1;

  if (isSingleLine) {
    const templateWithoutQuotes = lines[0].slice(1, -1);
    return templateWithoutQuotes;
  }

  const indentationSpaces = lines[0].match(/^\s*/)[0];
  return lines.map((line) => line.replace(indentationSpaces, '')).join('\n');
}

module.exports = extract;
