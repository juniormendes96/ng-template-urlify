const expect = require('expect.js');
const sut = require('./extract-template');

describe('extractTemplate', () => {
  it('returns null if input is falsy', () => {
    const inputs = ['', null, undefined];
    inputs.forEach((input) => expect(sut('./app-component.html', input)).to.be(null));
  });

  it('returns null if no Component decorator is found', () => {
    const inputs = [
      'const foo = "bar";',
      'export class AppComponent {}',
      `
      @Foo({
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
    const inputWithSingleQuotes = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      template: '<h1>Tour of Heroes</h1>',
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}

    `;

    const inputWithDoubleQuotes = `
    import { Component } from "@angular/core";

    @Component({
      selector: "app-root",
      template: "<h1>Tour of Heroes</h1>",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const inputWithBackticks = `
    import { Component } from "@angular/core";

    @Component({
      selector: "app-root",
      template: \`<h1>Tour of Heroes</h1>\`,
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedSingleQuoteComponent = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      templateUrl: './app-component.html',
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}

    `;

    const expectedDoubleQuoteComponent = `
    import { Component } from "@angular/core";

    @Component({
      selector: "app-root",
      templateUrl: "./app-component.html",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedBackticksComponent = `
    import { Component } from "@angular/core";

    @Component({
      selector: "app-root",
      templateUrl: "./app-component.html",
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent {}

    `;

    const expectedTemplateHtml = '<h1>Tour of Heroes</h1>';

    const singleQuotesResult = sut('./app-component.html', inputWithSingleQuotes);
    const doubleQuotesResult = sut('./app-component.html', inputWithDoubleQuotes);
    const backticksResult = sut('./app-component.html', inputWithBackticks);

    expect(singleQuotesResult.component).to.eql(expectedSingleQuoteComponent);
    expect(doubleQuotesResult.component).to.eql(expectedDoubleQuoteComponent);
    expect(backticksResult.component).to.eql(expectedBackticksComponent);

    expect(singleQuotesResult.templateHtml).to.eql(expectedTemplateHtml);
    expect(doubleQuotesResult.templateHtml).to.eql(expectedTemplateHtml);
    expect(backticksResult.templateHtml).to.eql(expectedTemplateHtml);
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

  it('uses the same quote kind as the first import', () => {
    const input = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      template: \`
        <h1>Tour of Heroes</h1>
      \`,
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}
    `;

    const expectedComponent = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      templateUrl: './app-component.html',
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}
    `;

    const result = sut('./app-component.html', input);

    expect(result.component).to.eql(expectedComponent);
  });

  it('uses double quote kind if no import is found', () => {
    const input = `
    @Component({
      selector: 'app-root',
      template: \`
        <h1>Tour of Heroes</h1>
      \`,
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}
    `;

    const expectedComponent = `
    @Component({
      selector: 'app-root',
      templateUrl: "./app-component.html",
      styles: ['h1 { font-weight: normal; }'],
    })
    export class AppComponent {}
    `;

    const result = sut('./app-component.html', input);

    expect(result.component).to.eql(expectedComponent);
  });
});
