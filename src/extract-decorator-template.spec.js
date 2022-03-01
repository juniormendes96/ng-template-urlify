const expect = require('expect.js');
const sut = require('./extract-decorator-template');

const expectEqual = (input, expected) => expect(sut(input)).to.eql(expected);

describe('extractDecoratorTemplate', () => {
  it('returns null if input is falsy', () => {
    const inputs = ['', null, undefined];
    inputs.forEach((input) => expect(sut(input)).to.be(null));
  });

  it('returns null if no template is found on decorator', () => {
    const inputs = [
      `

      @Component({
        selector: "app-root",
        styles: ["h1 { font-weight: normal; }"],
      })

      `,
      `

      @Component({
        selector: "app-root",
        templateUrl: "./app-component.html",
        styles: ["h1 { font-weight: normal; }"],
      })

      `,
    ];

    inputs.forEach((input) => expect(sut(input)).to.be(null));
  });

  it('returns correct template', () => {
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

    `;

    const expectedRaw = `template: \`
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

    expectEqual(input, { raw: expectedRaw, content: expectedContent });
  });
});
