function extractDecoratorTemplate(decorator) {
  const [raw, content] = (decorator || '').match(/template\s?:\s?\`(.+)\`/s) || [];

  if (!raw) {
    return null;
  }

  const singleLineContent = content.replace(/\n\s+/g, '');

  return { raw, content: singleLineContent };
}

module.exports = extractDecoratorTemplate;
