function extractMultiLine(decorator) {
  const [raw, content] = decorator.match(/template\s?:\s?\`(.+)\`/s) || [];

  if (!raw) {
    return null;
  }

  const singleLineContent = content.replace(/\n\s+/g, '');

  return { raw, content: singleLineContent };
}

function extractOneLine(decorator) {
  const [raw, content] = decorator.match(/template\s?:\s?'(.+)'/) || decorator.match(/template\s?:\s?"(.+)"/) || [];
  return raw ? { raw, content } : null;
}

function extractDecoratorTemplate(decorator) {
  if (!decorator) return null;

  const isOneLine = /template\s?:\s?['|"]/.test(decorator);

  if (isOneLine) {
    return extractOneLine(decorator);
  }

  return extractMultiLine(decorator);
}

module.exports = extractDecoratorTemplate;
