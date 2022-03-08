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

```bash
ng-template-urlify /path/to/your/files
```

## Rationale

Say you have a _huge_ project with lots of components and have been using inline templates since the beginning. For any reason (performance on VSCode is one of them – HTML templates perform much better than inline ones), you want to change all your components to have separate HTML files instead of inline properties.

This can come in handy – with one command you can transform all your components to have separate HTML files. Otherwise you would have to do it manually.

## License

[Apache 2.0](LICENSE)
