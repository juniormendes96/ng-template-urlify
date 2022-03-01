const expect = require('expect.js');
const extract = require('../src/extract');

const expectEqual = (input, expected) => expect(extract(input)).to.eql(expected);

describe('extract', () => {
  it('returns null if input is falsy', () => {
    const inputs = ['', null, undefined];
    inputs.forEach((input) => expectEqual(input, null));
  });

  it('returns null if no decorator is present', () => {
    const input = `
    export class AppComponent {
      constructor() {}
    }
    `;

    expectEqual(input, null);
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

    inputs.forEach((input) => expectEqual(input, null));
  });

  it('returns correct values', () => {
    const input = `

    @Component({
      selector: "app-root",
      template: \`
        <h1>Tour of Heroes</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
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

    const expectedTemplate = `template: \`
        <h1>Tour of Heroes</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
        <p>
          {{ paragraph }}
        </p>
        <div *ngIf="condition">
          <div>Content</div>
        </div>
        <button (click)="onClick({ someValue: 0 })">Click me</button>
      \``;

    const expectedContent =
      '<h1>Tour of Heroes</h1><app-hero-main [hero]="hero"></app-hero-main><p>{{ paragraph }}</p><div *ngIf="condition"><div>Content</div></div><button (click)="onClick({ someValue: 0 })">Click me</button>';

    expectEqual(input, { rawTemplate: expectedTemplate, templateContent: expectedContent });
  });

  it('extracts only the first component if, for any reason, there is more than one', () => {
    const input = `

    @Component({
      selector: "app-root-1",
      template: \`
        <h1>Tour of Heroes 1</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
      \`,
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent1 {}

    @Component({
      selector: "app-root-2",
      template: \`
        <h1>Tour of Heroes 2</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
      \`,
      styles: ["h1 { font-weight: normal; }"],
    })
    export class AppComponent2 {}

    `;

    const expectedTemplate = `template: \`
        <h1>Tour of Heroes 1</h1>
        <app-hero-main [hero]="hero"></app-hero-main>
      \``;

    const expectedContent = '<h1>Tour of Heroes 1</h1><app-hero-main [hero]="hero"></app-hero-main>';

    expectEqual(input, { rawTemplate: expectedTemplate, templateContent: expectedContent });
  });
});
