const expect = require('expect.js');
const sut = require('./extract-file-contents');

describe('extract', () => {
  it('returns null if input is falsy', () => {
    const inputs = ['', null, undefined];
    inputs.forEach((input) => expect(sut('./app-component.html', input)).to.be(null));
  });

  it('returns null if no Component decorator is found', () => {
    const inputs = [
      'export class AppComponent {}',
      `
      @AnyDecorator({
        selector: "app-root",
        styles: ["h1 { font-weight: normal; }"],
      })
      export class AppComponent {}
      `,
    ];

    inputs.forEach((input) => expect(sut('./app-component.html', input)).to.be(null));
  });

  it('returns null if no template is found on decorator', () => {
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

    inputs.forEach((input) => expect(sut('./app-component.html', input)).to.be(null));
  });

  it('returns correct result when the template has multiple lines', () => {
    const input = `

    @Component({
      selector: "app-root",
      template: \`
        <h1>Tour of Heroes</h1>
        <app-hero-main
          [hero]="hero"
          [heroes]="heroes"
          *ngIf="heroes.length"
        ></app-hero-main>
        <p>
          {{ paragraph }}
        </p>
        <div *ngIf="condition">
          <div>Content</div>
        </div>
        <button (click)="onClick({ someValue: 0 })">Click me</button>
      \`,
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedComponent = `

    @Component({
      selector: "app-root",
      templateUrl: "./app-component.html",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedTemplateHtml =
      '<h1>Tour of Heroes</h1>\n<app-hero-main\n  [hero]="hero"\n  [heroes]="heroes"\n  *ngIf="heroes.length"\n></app-hero-main>\n<p>\n  {{ paragraph }}\n</p>\n<div *ngIf="condition">\n  <div>Content</div>\n</div>\n<button (click)="onClick({ someValue: 0 })">Click me</button>';

    const result = sut('./app-component.html', input);

    expect(result.component).to.eql(expectedComponent);
    expect(result.templateHtml).to.eql(expectedTemplateHtml);
  });

  it('returns correct result when the template has single line', () => {
    const input = `

    @Component({
      selector: "app-root",
      template: "<h1>Tour of Heroes</h1>",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedComponent = `

    @Component({
      selector: "app-root",
      templateUrl: "./app-component.html",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedTemplateHtml = '<h1>Tour of Heroes</h1>';

    const result = sut('./app-component.html', input);

    expect(result.component).to.eql(expectedComponent);
    expect(result.templateHtml).to.eql(expectedTemplateHtml);
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

    const expectedComponent = `

    @Component({
      selector: "app-root-1",
      templateUrl: "./app-component.html",
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

    const expectedTemplateHtml = '<h1>Tour of Heroes 1</h1>';

    const result = sut('./app-component.html', input);

    expect(result.component).to.eql(expectedComponent);
    expect(result.templateHtml).to.eql(expectedTemplateHtml);
  });

  it('uses the same quote kind as the selector property', () => {
    const singleQuoteInput = `

    @Component({
      selector: 'app-root',
      template: \`
        <h1>Tour of Heroes</h1>
      \`,
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}

    `;

    const doubleQuoteInput = `

    @Component({
      selector: "app-root",
      template: \`
        <h1>Tour of Heroes</h1>
      \`,
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedSingleQuoteComponent = `

    @Component({
      selector: 'app-root',
      templateUrl: './app-component.html',
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}

    `;

    const expectedDoubleQuoteComponent = `

    @Component({
      selector: "app-root",
      templateUrl: "./app-component.html",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const singleQuoteResult = sut('./app-component.html', singleQuoteInput);
    const doubleQuoteResult = sut('./app-component.html', doubleQuoteInput);

    expect(singleQuoteResult.component).to.eql(expectedSingleQuoteComponent);
    expect(doubleQuoteResult.component).to.eql(expectedDoubleQuoteComponent);
  });
});
