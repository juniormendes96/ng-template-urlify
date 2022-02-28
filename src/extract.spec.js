const expect = require('expect.js');
const extract = require('../src/extract');

const expectEqual = (input, expected) => expect(extract(input)).to.eql(expected);

describe('extract', () => {
  it('returns empty if no decorator is present', () => {
    const inputs = [
      `
      export class AppComponent {
        constructor() {}
      }
      `,
      '',
    ];

    inputs.forEach((input) => expectEqual(input, {}));
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
});
