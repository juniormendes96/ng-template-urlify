const EMPTY = {};

function extract(input) {
  if (!input) {
    return EMPTY;
  }

  const [decoratorMatch] = input.match(/\@Component.*?\}\)/s) || [];

  if (!decoratorMatch) {
    return EMPTY;
  }

  const [template, templateContent] = decoratorMatch.match(/template:\s?\`(.+)\`/s) || [];

  if (!template) {
    return EMPTY;
  }

  return { template, templateContent };
}

module.exports = extract;
