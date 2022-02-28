const EMPTY = {};

function extract(input) {
  if (!input) {
    return EMPTY;
  }

  const [decoratorMatch] = input.match(/\@Component.*?\}\)/s) || [];

  if (!decoratorMatch) {
    return EMPTY;
  }

  const [rawTemplate, templateContent] = decoratorMatch.match(/template:\s?\`(.+)\`/s) || [];

  if (!rawTemplate) {
    return EMPTY;
  }

  const singleLineContent = templateContent.replace(/\n\s+/g, '');

  return { rawTemplate, templateContent: singleLineContent };
}

module.exports = extract;
