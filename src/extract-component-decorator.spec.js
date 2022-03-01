const expect = require('expect.js');
const sut = require('./extract-component-decorator');

describe('extractComponentDecorator', () => {
  it('returns null if input is falsy', () => {
    const inputs = ['', null, undefined];
    inputs.forEach((input) => expect(sut(input)).to.be(null));
  });

  it('returns null if no component decorator is present', () => {
    const inputs = [
      `

      export class AppComponent {
        constructor() {}
      }
      
      `,
      `
      
      @SomeDecorator({ someValue: 'value' })
      export class AppComponent {}
      
      `,
    ];

    inputs.forEach((input) => expect(sut(input)).to.be(null));
  });

  it('returns decorator using either "class" or "export class"', () => {
    const inputWithExport = `

    @Component({
      selector: "app-root",
      template: '<h1>Tour of Heroes</h1>',
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const inputWithoutExport = `

    @Component({
      selector: "app-root",
      template: '<h1>Tour of Heroes</h1>',
      styles: ["h1 { font-weight: normal; }"],
    })
    class AppComponent {}

    `;

    const expected = `@Component({
      selector: "app-root",
      template: '<h1>Tour of Heroes</h1>',
      styles: ["h1 { font-weight: normal; }"],
    })`;

    expect(sut(inputWithExport)).to.be(expected);
    expect(sut(inputWithoutExport)).to.be(expected);
  });

  it('returns decorator if there are extra spaces between the decorator and the class', () => {
    const input = `

    @Component({
      selector: "app-root",
      template: '<h1>Tour of Heroes</h1>',
      styles: ["h1 { font-weight: normal; }"],
    })

    
    class AppComponent {}

    `;

    const expected = `@Component({
      selector: "app-root",
      template: '<h1>Tour of Heroes</h1>',
      styles: ["h1 { font-weight: normal; }"],
    })`;

    expect(sut(input)).to.be(expected);
  });

  it('extracts only the first component if there is more than one', () => {
    const input = `

    @Component({
      selector: "app-root-1",
      template: "<h1>Tour of Heroes 1</h1>",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent1 {}

    @Component({
      selector: "app-root-2",
      template: "<h1>Tour of Heroes 2</h1>",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent2 {}

    `;

    const expected = `@Component({
      selector: "app-root-1",
      template: "<h1>Tour of Heroes 1</h1>",
      styles: ["h1 { font-weight: normal; }"],
    })`;

    expect(sut(input)).to.be(expected);
  });
});
