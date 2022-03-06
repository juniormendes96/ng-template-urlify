function extractMultipleLines(decorator) {
  const [raw, content] = decorator.match(/template\s?:\s?\`(.+)\`/s) || [];

  if (!raw) {
    return null;
  }

  const contentWithNoLineBreaks = content.replace(/\n\s+/g, '');

  return { raw, content: contentWithNoLineBreaks };
}

function extractSingleLine(decorator) {
  const [raw, content] = decorator.match(/template\s?:\s?'(.+)'/) || decorator.match(/template\s?:\s?"(.+)"/) || [];
  return raw ? { raw, content } : null;
}

function extractDecoratorTemplate(decorator) {
  if (!decorator) return null;

  const isSingleLineTemplate = /template\s?:\s?['|"]/.test(decorator);

  if (isSingleLineTemplate) {
    return extractSingleLine(decorator);
  }

  return extractMultipleLines(decorator);
}

module.exports = extractDecoratorTemplate;
