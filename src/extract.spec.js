const expect = require('expect.js');
const extract = require('../src/extract');

const expectEqual = (input, expected) => expect(extract(input)).to.eql(expected);

describe('extract', () => {
  it('returns empty if input is falsy', () => {
    const inputs = ['', null, undefined];
    inputs.forEach((input) => expectEqual(input, {}));
  });

  it('returns empty if no decorator is present', () => {
    const input = `
    export class AppComponent {
      constructor() {}
    }
    `;

    expectEqual(input, {});
  });

  it('returns empty if no template is found on decorator', () => {
    const inputs = [
      `
      @Component({
        selector: "app-root",
        styles: ["h1 { font-weight: normal; }"],
      })
      export class AppComponent {}
      `,
      `
      @Component({
        selector: "app-root",
        templateUrl: "./app-component.html",
        styles: ["h1 { font-weight: normal; }"],
      })
      export class AppComponent {}
      `,
    ];

    inputs.forEach((input) => expectEqual(input, {}));
  });

  it('returns correct values', () => {
    const input = `

    @Component({
      selector: "app-root",
      template: \`
        <h1>Tour of Heroes</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
        <p>
          Paragraph
        </p>
      \`,
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedTemplate = `template: \`
        <h1>Tour of Heroes</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
        <p>
          Paragraph
        </p>
      \``;

    const expectedContent = '<h1>Tour of Heroes</h1><app-hero-main [hero]="hero"></app-hero-main><p>Paragraph</p>';

    expectEqual(input, { rawTemplate: expectedTemplate, templateContent: expectedContent });
  });
});
