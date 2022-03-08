# Angular Inline Template to HTML

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
```

## Installation

```bash
npm install -g ng-inline-template-to-html
```

## Usage

```bash
ng-inline-template-to-html /path/to/your/files
```
