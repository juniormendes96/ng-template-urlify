function extract(input) {
  if (!input) {
    return null;
  }

  const [componentDecorator] = input.match(/\@Component.*?class|export class/s) || [];

  if (!componentDecorator) {
    return null;
  }

  const [rawTemplate, templateContent] = componentDecorator.match(/template\s?:\s?\`(.+)\`/s) || [];

  if (!rawTemplate) {
    return null;
  }

  const singleLineContent = templateContent.replace(/\n\s+/g, '');

  return { rawTemplate, templateContent: singleLineContent };
}

module.exports = extract;
