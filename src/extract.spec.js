const expect = require('expect.js');
const extract = require('../src/extract');

const expectEqual = (input, expected) => expect(extract(input)).to.eql(expected);

describe('extract', () => {
  it('keeps the same content if no decorator is present', () => {
    const input = `
      export class AppComponent {
        constructor() {}
      }
    `;

    const expected = { output: input, component: null };

    expectEqual(input, expected);
  });

  it('keeps the same content if no template is found on decorator', () => {
    const input = `
      @Component({
        selector: "app-root",
        styles: ["h1 { font-weight: normal; }"],
      })
      export class AppComponent {}
    `;

    const expected = { output: input, component: null };

    expectEqual(input, expected);
  });
});
