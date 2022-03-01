function extractComponentDecorator(fileContent) {
  const [componentDecorator] = (fileContent || '').match(/\@Component.*?(?=class|export class)/s) || [];
  return componentDecorator ? componentDecorator.trim() : null;
}

module.exports = extractComponentDecorator;
