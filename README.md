# Angular Template URLify

Replace all your component inline `template` properties with `templateUrl` and generate the respective HTML files automatically.

### Before

```ts
// app.component.ts

@Component({
  selector: 'app-root',
  template: `
    <h1>Tour of Heroes</h1>
    <p>Lorem ipsum</p>
  `,
})
export class AppComponent {}
```

### After

```ts
// app.component.ts

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->

<h1>Tour of Heroes</h1>
<p>Lorem ipsum</p>
```

## Installation

```bash
npm install -g ng-template-urlify
```

## Usage

Firstly, make sure you are using some version control system like Git or you have a backup of your project. **This will overwrite your existing TS files.**

Once you've done that, run:

```bash
npx ng-template-urlify /path/to/your/files
```

or

```bash
npm install -g ng-template-urlify
ng-template-urlify /path/to/your/files
```

## Rationale

Say you have a _huge_ project with lots of components and have been using inline templates since the beginning. For any reason (performance on VSCode is one of them – HTML templates perform much better than inline ones), you want to change all your components to have separate HTML files instead of inline properties.

This will come in handy – with one command you can transform all your components to have separate HTML files. Otherwise you would have to do it manually.

## License

[Apache 2.0](LICENSE)
