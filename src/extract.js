function extract(input) {
  if (!input) {
    return null;
  }

  const [decoratorMatch] = input.match(/\@Component.*?\}\)/s) || [];

  if (!decoratorMatch) {
    return null;
  }

  const [rawTemplate, templateContent] = decoratorMatch.match(/template:\s?\`(.+)\`/s) || [];

  if (!rawTemplate) {
    return null;
  }

  const singleLineContent = templateContent.replace(/\n\s+/g, '');

  return { rawTemplate, templateContent: singleLineContent };
}

module.exports = extract;
