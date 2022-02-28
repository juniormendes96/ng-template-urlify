const expect = require('expect.js');
const extract = require('../src/extract');

describe('extract', () => {
  it('keeps the same content if no decorator is present', () => {
    const input = `
      export class AppComponent {
        constructor() {}
      }
    `;

    const expected = {
      output: input,
      component: null,
    };

    const result = extract(input);

    expect(result).to.eql(expected);
  });
});
