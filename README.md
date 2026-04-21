# Renderize

**Renderize.js** is a JavaScript library that facilitates flexible and dynamic rendering of HTML templates based on a provided array of objects. It supports various rendering types, lazy loading of images, flexible templating options, skeleton/placeholder loading, auto-fetch, pagination, and auto-load — all with extensive configuration options.

---

## Installation

```bash
npm i renderize
```

## Include the Renderize library in your project

#### Import AutoLoad to use the AutoLoad feature.

```javascript
import AutoLoad from 'renderize/autoload'
```

#### Import Pagination to use the Pagination feature.

```javascript
import Pagination from 'renderize/pagination'
```

---

## Getting Started

```html
<div id="viewContainer"></div>
```

```javascript
// Sample data
let data = [
  { /* ... */ },
  // Additional data objects
];

// Initialize Renderize
const viewContainer = document.getElementById("viewContainer");
const renderize = new AutoLoad(viewContainer, data);

// Configure Renderize settings
// Note: view must be set here in config, not in render() or loading()
renderize.config({
  perLoad: 20,
  gridGap: "20px",
  view: "grid",
  // Add other configuration options
});

// Set templates for grid, list, and table views
renderize.gridItemTemplate = `<div class="card"> ... </div>`;
renderize.listItemTemplate = `<div class="card"> ... </div>`;
renderize.tableRowHtml = `<tr> ... </tr>`;

// Render HTML
renderize.render();

// For Errors
console.error(renderize.errors);
```

> **Important:** The `view` type must be set inside `config({ view: 'grid' })`. Do not attempt to set the view inside `render()` or `loading()`.

---

## Configuration Options (AutoLoad and Pagination)

### Debug Configuration

1. **debug**: Whether to enable debug mode. When `true`, basic validations run on templates and config URLs like `apiSearching`, `dataApiUrl`, and item templates — and error messages are pushed to `renderize.errors`. Some validations still apply even when `false`. Default is `true`.

### Skeleton / Placeholder Loading Configuration

1. **loadingClass**: Class applied to placeholder elements. Default is `'placeholder'`. You may provide multiple classes separated by a space (e.g., `'placeholder skeleton'`).
2. **loadingPerPage**: Number of placeholder items rendered per page (Pagination only). Default is the value of `perPage`.
3. **loadingPerLoad**: Number of placeholder items rendered per load (AutoLoad only). Default is the value of `perLoad`.

**Placeholder attributes in your HTML template:**

Use `data-placeholder` on any element to mark it as a skeleton target. You can apply inline styles exclusively for the loading state using `data-`-prefixed style attributes:

```html
<div data-placeholder data-width="100%" data-height="90px" data-display="block" data-border-radius="8px">
  Content here
</div>
```

Any CSS property can be applied via `data-{property}` and it will only be active during the placeholder/loading phase. Use `data-placeholder-remove` to remove an element entirely during the loading phase:

```html
<button data-placeholder-remove>Add to Cart</button>
```

You can also use a self-closing `<placeholder>` tag directly inside your template to insert a placeholder-only element:

```html
<placeholder data-width="60px" data-height="20px" />
```

Use `data-placeholder-dark` instead of `data-placeholder` to apply a darker variant class (`loadingClass-dark`) for dark-themed skeletons.

### Grid View Configuration

1. **gridGap**: Gap between grid items. Default is `'10px'`.
2. **gridItemMinWidth**: Minimum width of grid items. Default is `'200px'`. Percentage values are not allowed.
3. **gridItemWidth**: Width of grid items, or `"fit"` for dynamic width. Default is `'fit'`. Percentage values are not allowed.
4. **gridContainerClass**: Class applied to the grid container. Default is `'data-view-grid'`. Multiple classes can be provided separated by a space.

### List View Configuration

1. **listGap**: Gap between list items. Default is `'10px'`.
2. **listItemMinWidth**: Minimum width of list items. Default is `'500px'`. Percentage values are not allowed.
3. **listItemWidth**: Width of list items, or `"fit"` for dynamic width. Default is `'fit'`. Percentage values are not allowed.
4. **listContainerClass**: Class applied to the list container. Default is `'data-view-list'`. Multiple classes can be provided separated by a space.

### Table View Configuration

1. **tableClass**: Class applied to the table element. Default is `'data-view-table'`. Multiple classes can be provided separated by a space (e.g., `'table table-striped'`).

### Positioning

1. **position**: Alignment of items within the grid or list container. Does not apply when using fit width. Default is `'LEFT'`.

Available options: `'LEFT'`, `'CENTER'`, `'RIGHT'`, `'BETWEEN'`, `'AROUND'`, `'EVENLY'`

### Search Configuration

1. **searchBody**: Default body/params injected into all search API requests. Can also be set at any time via `renderize.searchBody = { keyword: "" }` or passed directly to the `search()` method.
2. **searchIn**: Column to search in for local searching. Default is `'all'`. (Replaces the deprecated `column` placeholder.)
3. **searchCaseSensitive**: Whether local search is case-sensitive. Default is `false`.
4. **apiSearching**: Enable server-side searching through an API. Default is `false`. When `false`, searching is **local** — Renderize searches across the data it already holds.
5. **searchApiUrl**: API URL for server-side searching. Default is `''`. POST method is also supported.
6. **searchApiOptions**: Fetch API options for search requests. Default is `{}`. Example: `{ headers: { "Content-Type": "application/json" } }`.

### Auto-fetch Configuration

1. **autoFetch**: Whether to automatically fetch more data from the API as data runs low. Default is `false`. If `fetchedDataLength` is provided, Renderize manages this automatically — you do not need to set `autoFetch` manually.
2. **autoFetchWhen**: The number of unrendered items to maintain in the buffer before triggering an auto-fetch. For example, if set to `40`, Renderize ensures there are always at least 40 upcoming rows pre-fetched. Default is `40`.
3. **dataApiUrl**: API URL for fetching additional data. Default is `''`. POST method is also supported.
4. **dataApiOptions**: Fetch API options for data fetch requests. Default is `{}`. Example: `{ headers: { "Content-Type": "application/json" } }`.
5. **dataBody**: Body/params passed with auto-fetch data API requests. Supports API Placeholders (see below).
6. **fetchedDataLength**: Optional. When set to a number, Renderize automatically manages `autoFetch` based on the API response length. If the API returns fewer records than `fetchedDataLength`, it means no more data is available — Renderize stops further auto-fetch requests automatically. Default is `false`.

   Example: Set `fetchedDataLength: 30`. If the API is expected to return 30 records per request but only returns 12, Renderize knows the data source is exhausted and disables further fetching automatically.

### Lazy Load Image

1. **lazyloadImageColor**: Background color shown while a lazy-loaded image is loading. Default is `'#eee'`.

---

## Configuration Options for AutoLoad

### Auto-loading Configuration

1. **autoload**: Whether to automatically load more data as the user scrolls. Default is `true`. **This option only applies to the AutoLoad class.**
2. **autoloadWhen**: Number of items from the end of the list that triggers the next load. Default is `10`.
3. **autoloadMargin**: IntersectionObserver `rootMargin` value that controls how far ahead of the scroll trigger the load fires. Default is `'0px'`. Example: `'200px'` to load earlier.
4. **perLoad**: Number of items per load. Default is `20`.

### Auto-cleaning Configuration

1. **autoCleanupWhen**: When the rendered item count in a view container exceeds this number, the previous container is emptied when switching views. Default is `100`.

---

## Configuration Options for Pagination

### Pagination

1. **perPage**: Number of items per page. Default is `20`.

### Animation

1. **animation**: Apply a page-change animation effect. Default is `false`. Options: `"slide"`, `"fade"`.
2. **animationDuration**: Duration of the animation. Default is `'.5s'`. The CSS variable `--animation-duration` in `animations.css` should also be set to match.

**Note:** To use animations, include the animations CSS file:

```html
<link rel="stylesheet" href="path/to/renderize/animations.css">
```

---

## API Placeholders

These placeholders are resolved dynamically when building API request URLs or bodies.

### For `dataApiUrl` / `dataBody`

| Placeholder | Description |
|---|---|
| `{last}` or `{last:index}` | The last index of the current dataset. E.g. if you have 40 items, returns `39`. |
| `{last:counter}` | The last counter/length of the current dataset. E.g. if you have 40 items, returns `40`. |
| `{last:column}` | The value of a specific column from the last fetched row. Replace `column` with your column name. |
| `{perLoad}` | The current value of `perLoad` (AutoLoad only). |
| `{perPage}` | The current value of `perPage` (Pagination only). |
| `{nextPage}` | The next required page number. Calculated as `totalPages + 1`. For example, if Renderize has calculated 5 pages from the existing data, `{nextPage}` returns `6`. Works in both AutoLoad and Pagination. |

### For `searchApiUrl` / `searchBody`

| Placeholder | Description |
|---|---|
| `{query}` | The search query string (used for local search key as well). |
| `{searchCaseSensitive}` | Whether the search is case-sensitive. Returns `true` or `false`. |
| `{searchIn}` | The column being searched. Returns the `searchIn` config value. |
| `{last}` or `{last:index}` | Same as above. |
| `{last:counter}` | Same as above. |
| `{last:column}` | Same as above. |
| `{perLoad}` | The current `perLoad` value (AutoLoad only). |
| `{perPage}` | The current `perPage` value (Pagination only). |
| `{nextPage}` | The next required page based on internal search state `totalPages`. Resets on each new search. |

---

## Templating Engine

### One-time Parse Placeholders (`{{}}`)

Evaluated once when the template is first registered.

| Placeholder | Description |
|---|---|
| `{{date:d}}` | Current day of the month (e.g., `30`). |
| `{{date:m}}` | Current month (e.g., `6`). |
| `{{date:y}}` | Current year (e.g., `2024`). |
| `{{time:h}}` | Current hour. |
| `{{time:m}}` | Current minute. |
| `{{time:s}}` | Current second. |
| `{{loadimage\|height\|width?\|img_tag}}` | Lazy loads an image. Width is optional. |

### Per-row Placeholders (`{%% %}`)

Evaluated for every data row during rendering.

| Placeholder | Description |
|---|---|
| `{%column:column_name%}` | Value of the specified column. |
| `{%column:column_name[key]%}` | Value of a key inside a column if the column is an object or array. |
| `{%counter%}` | The current row's 1-based iteration number. |

### Filters

Append filters after a `|` in column placeholders.

| Filter | Description |
|---|---|
| `{%column:column_name\|upper%}` | Converts all letters to uppercase. |
| `{%column:column_name\|lower%}` | Converts all letters to lowercase. |
| `{%column:column_name\|firstCap%}` | Capitalizes the first letter. |
| `{%column:title\|length:20%}` | Limits value to specified number of characters. Change `20` to any number. |
| `{%column:column_name\|formatNum%}` | Formats number with commas (e.g., `100000` → `100,000`). |

### Conditional Rendering

Condition is evaluated against the column value (truthy/falsy). The `{%else%}` block is required.

```html
{%if column:column_name %}
  <button class="btn btn-primary">Add</button>
{%else%}
  <button class="btn btn-danger">Delete</button>
{%endif%}
```

### Lazy Load Image Examples

```javascript
{{loadimage|40px|40px|<img src="..." class="..." alt="...">}}
{{loadimage|40px|<img src="..." class="..." alt="...">}}
```

### Template Example

```javascript
// Sample data
let data = [
  {
    img: "example.png",
    title: 'Example Title',
    price: '120000',
    rating: 5,
    brand: "example",
    discount: "30%",
    liked: true
  },
];

// Initialize Renderize
const viewContainer = document.getElementById("viewContainer");
const renderize = new AutoLoad(viewContainer, data);

renderize.config({
  perLoad: 20,
  gridGap: "20px",
  view: "grid",
});

// Set template for grid view
renderize.gridItemTemplate = `<div class="card custom-card">
  <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">{%counter%}</span>

  {{loadimage|120px|100%|<img src="images/{%column:img%}" class="card-img-top" alt="Product Image" loading="lazy">}}

  <div class="card-body">
    <h5 class="card-title">{%column:title|firstCap%}</h5>
    <div class="card-badge">
      <span class="badge bg-primary">{%column:brand|upper%}</span>
    </div>
    <div class="card-details">
      <div class="price-rating">
        <span class="price">Rs{%column:price|formatNum%}</span>
        <span class="rating">Rating: {%column:rating%}</span>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      {%if column:liked %}
        <button class="btn-sm btn-primary">Liked</button>
      {%else%}
        <button class="btn-sm btn-dark">Like</button>
      {%endif%}
    </div>
  </div>
</div>`;

renderize.render();
```

---

## Constructors

### `new AutoLoad(Container, Data = [])`

| Parameter | Type | Description |
|---|---|---|
| `Container` | HTMLElement | The HTML container element. |
| `Data` | Array | (Optional) Array of objects to render. Can be omitted if loading data from an API — use `updateData()` after fetching. |

```javascript
const renderize = new AutoLoad(container);
// or
const renderize = new AutoLoad(container, data);
```

### `new Pagination(Container, Data = [])`

| Parameter | Type | Description |
|---|---|---|
| `Container` | HTMLElement | The HTML container element. |
| `Data` | Array | (Optional) Array of objects to render. Can be omitted if loading data from an API — use `updateData()` after fetching. |

```javascript
const renderize = new Pagination(container);
// or
const renderize = new Pagination(container, data);
```

> **Tip:** Omitting `Data` is useful when you want to show a skeleton loading state immediately, then fetch data from an API and load it afterward:
>
> ```javascript
> const renderize = new AutoLoad(container);
> renderize.config({ view: "grid", /* ... */ });
> renderize.gridItemTemplate = `...`;
> renderize.loading(); // show skeleton
>
> fetch("https://api.example.com/items")
>   .then(res => res.json())
>   .then(data => {
>     renderize.updateData(() => data.items);
>     renderize.load();
>   });
> ```

---

## Methods (AutoLoad and Pagination)

### `config(Options)`

Configures all rendering options. Must be called before setting templates or rendering.

```javascript
renderize.config({
  view: "grid",
  perLoad: 20,
  autoFetch: true,
  dataApiUrl: "https://api.example.com/items",
  animation: "fade",
});
```

### `render()`

Renders the data from the beginning (first page / first load).

```javascript
renderize.render();
```

### `loading()`

Renders skeleton/placeholder items based on the active template. Call this **before** data is available to show a loading state. Combine with `load()` once data is ready.

```javascript
// Show loading skeletons
renderize.loading();

// Later, when data arrives:
renderize.load();
```

`loading()` can also be called inside `beforeAutofetch` to show placeholders during background fetches.

### `load()`

Renders newly updated data when placeholders are active, or when new API data has arrived. Also acts as a manual "load more" trigger when `autoload` is disabled.

```javascript
renderize.load();
```

### `removeLoading()`

Manually removes any active skeleton/placeholder loading elements from the view container. Useful when you need to cancel a loading state or if an API request fails.

```javascript
renderize.removeLoading();
```

### `search(Body)`

Searches for data based on the provided body/params. Updates the displayed results.

For **local searching** (default when `apiSearching` is `false`), pass `{ query: 'your search text' }`. Renderize searches across the data it already holds.

For **API searching**, pass the full body/params your API expects.

```javascript
// Local search
renderize.search({ query: "example" });

// API search with custom params
renderize.search({ q: "example", limit: 20, page: "{nextPage}" });
```

> **Note:** `search()` is prohibited when Selection Mode is active.

### `resetSearch()`

Exits the search state and returns to the main data view without overriding manually managed data.

```javascript
renderize.resetSearch();
```

### `updateData(Callback)`

Updates the internal data array. The callback receives the current data and should return the new data.

```javascript
renderize.updateData((currentData) => {
  return newDataArray;
});
```

### `gridItemTemplate` (setter)

Sets the HTML template for grid items.

```javascript
renderize.gridItemTemplate = `<div class="card"> ... </div>`;
```

### `listItemTemplate` (setter)

Sets the HTML template for list items.

```javascript
renderize.listItemTemplate = `<div class="card"> ... </div>`;
```

### `tableRowHtml` (setter)

Sets the HTML template for table rows.

```javascript
renderize.tableRowHtml = `<tr> ... </tr>`;
```

### `tableColumns` (setter)

Sets the table headings. Must be called after `tableRowHtml` is set.

```javascript
renderize.tableColumns = ["S.no", "Name", "Price"];
```

### `view` (setter)

Changes the active view mode. Must not be called when Selection Mode is active. Must not be called when in Search state if searching is active.

```javascript
renderize.view = "grid"; // "grid" | "list" | "table"
```

### `totalPages` (getter)

Returns the total number of pages. Automatically returns the correct value for whichever state is active — **main** or **search**.

```javascript
const total = renderize.totalPages;
```

### `currentPage` (getter)

Returns the current page number. Automatically returns the correct value for the active state — **main** or **search**.

```javascript
const current = renderize.currentPage;
```

> **Note:** Both `totalPages` and `currentPage` also apply to AutoLoad, since AutoLoad tracks pages internally for auto-fetch and API pagination purposes.

### `errors` (getter)

Returns the array of validation/runtime errors.

```javascript
console.error(renderize.errors);
```

### `startSelection(Callback, Options)`

Initiates selection mode, allowing users to multi-select items.

> **Important:** For Selection Mode to work, the root element of your item template must have `position: relative` set.
>
> **Restrictions in Selection Mode:**
> - `search()` is disabled.
> - `view` setter is disabled.
> - For Pagination: `nextPage()`, `previousPage()`, and `jumpToPage()` are disabled.

```javascript
renderize.startSelection((currentElement) => {
  // Handle selection events
}, {
  top: "auto",
  right: "7px",
  bottom: "7px",
  left: "auto",
  class: "selectionCheckbox" // Default is "selection"
});
```

### `stopSelection()`

Exits selection mode and clears all selections.

```javascript
renderize.stopSelection();
```

### `beforeAutofetch` (event)

Fires before a background data fetch begins.

```javascript
renderize.beforeAutofetch = () => {
  loaderContainer.classList.remove("hidden");
  console.log("Fetching more data...");
};
```

### `afterAutofetch` (event)

Fires after a background data fetch completes — for **both main data fetching and API searching**. Use the `state` parameter to distinguish between them. A return value is **required** — return the array of items from your response.

```javascript
renderize.afterAutofetch = (state, response) => {
  loaderContainer.classList.add("hidden");

  // state = "main" | "search"
  console.log("Fetch state:", state);

  // response = {
  //   success: true,
  //   data: [ { /* ... */ } ]
  // }
  // Extract and return the actual data array from the response:
  return response.data;
};
```

> **Note:** `afterSearching` is **deprecated** as of v3.0.0. Use `afterAutofetch` instead, checking the `state` parameter to handle search vs main fetch separately.

---

## Methods for Pagination

### `perPage` (setter)

Sets the number of items per page.

```javascript
renderize.perPage = 30;
```

### `nextPage()`

Moves to the next page. Prohibited in Selection Mode.

```javascript
renderize.nextPage();
```

### `previousPage()`

Moves to the previous page. Prohibited in Selection Mode.

```javascript
renderize.previousPage();
```

### `jumpToPage(PageNumber)`

Jumps to a specific page. Prohibited in Selection Mode.

```javascript
renderize.jumpToPage(3);
```

---

## Methods for AutoLoad

### `beforeAutoload` (event)

Fires before more items are appended via auto-loading.

```javascript
renderize.beforeAutoload = () => {
  loaderContainer.classList.remove("hidden");
  console.log("Loading more items...");
};
```

### `afterAutoload` (event)

Fires after more items have been appended via auto-loading.

```javascript
renderize.afterAutoload = () => {
  loaderContainer.classList.add("hidden");
  console.log("More items loaded.");
};
```

### `cleanUp()`

Manually triggers the cleanup process on the current or specified view, removing rendered elements and resetting the render state. Useful when you want to force a fresh re-render.

```javascript
renderize.cleanUp();
```

---

## Templator Class

The `Templator` class allows you to extend Renderize's rendering pipeline with custom parse logic applied globally (once) or per row.

### Constructor

```javascript
class MyTemplator {
  #templatingBasicMethods;

  constructor(TemplatingBasicMethods) {
    this.#templatingBasicMethods = TemplatingBasicMethods;
  }
}
```

### `oneTimeParse(Template)`

Called once when the template is set. Modify the template globally before rendering begins.

```javascript
class MyTemplator {
  oneTimeParse(template) {
    return template.replace(/\[\[custom\]\]/g, '<span class="custom"></span>');
  }
}
```

### `parseOnEveryRow(Template, Data, RowNumber)`

Called for every data row. Modify the template dynamically based on row data.

```javascript
class MyTemplator {
  parseOnEveryRow(template, data, rowNumber) {
    return template.replace('{{rowIndex}}', rowNumber);
  }
}
```

### Registering a Templator

Register before setting item templates.

```javascript
renderize.register.templator(MyTemplator);

renderize.gridItemTemplate = `<div class="card"> ... </div>`;
renderize.render();
```

---

## Arithmetic Templator
```javascript
export class Templator{
    #templatingBasicMethods
    constructor(TemplatingBasicMethods){
        this.#templatingBasicMethods = TemplatingBasicMethods
    }
    parseOnEveryRow(Template,Data){
        const placeholderRegex = /{%([^%}]*?)<*>%}/g;
        let renderedTemplate = Template.replace(placeholderRegex,(match,placeholder)=>{
            let returnValue = match;
            let [type,more,value,operationByColumn] = placeholder.split(":")
            if (type!="column") {return match}
            let [column,others] = more.split("|")
            let formate,operation;
            if (others==undefined) {
                [column,operation] = column.split("<");
            }else{
                [formate,operation] = others.split("<");
            }
            if (Data[column]==undefined) {return;}
            const data = parseInt(Data[column]);
            if (value=="column") {value = String(Data[operationByColumn])}
            switch (operation) {
                case 'add':
                    let addBy = parseInt(value);
                    if (value.endsWith("%")) {
                        addBy = (addBy / 100) * data
                    }
                    returnValue= data + addBy
                    break;
                case 'sub':
                    let subBy = parseInt(value);
                    if (value.endsWith("%")) {
                        subBy = (subBy / 100) * data
                    }
                    returnValue= data - subBy
                    break;
                case 'subpub':
                    let subpubBy = parseInt(value);
                    subpubBy = (subpubBy / 100) * data
                    returnValue= data - subpubBy
                    break;
                case 'mult':
                    let multBy = parseInt(value);
                    if (value.endsWith("%")) {
                        multBy = (multBy / 100) * data
                    }
                    returnValue= data * multBy
                    break;
                case 'div':
                    let divBy = parseInt(value);
                    if (value.endsWith("%")) {
                        divBy = (divBy / 100) * data
                    }
                    returnValue= data / divBy
                    break;
            }
            if (formate=="formatNum") {
                returnValue = this.#templatingBasicMethods.formatNum(returnValue)                    
            }
            return returnValue
        });
        return renderedTemplate
    }
}
```

### Code

```javascript
import Renderize from 'renderize';
import { Templator } from "./templators/arithmeticTemplator.js"; // replace with your actual Templator path

// Sample data
let data = [
  { /* ... */ },
  // Additional data objects
];

// Initialize Renderize
const viewContainer = document.getElementById("viewContainer")
const renderize = new AutoLoad(viewContainer, data);

// Configure Renderize settings
renderize.config({
  perLoad: 30,
  gridGap: "20px",
  // Add other configuration options
});


renderize.register.templator(Templator) 

// Set templates for grid, list, and table views
renderize.gridItemTemplate = `<div class="card">{/* ... */}</div>`;
renderize.listItemTemplate = `<div class="card">{/* ... */}</div>`;
renderize.tableRowHtml = `<tr>{/* ... */}</tr>`;

// Render the Renderize
renderize.render();
// For Errors
console.error(renderize.errors);
```

### Placeholder
1. **Addition (+)**
Add values from another column or a static value.

```
{%column:price<add:column:discount>%} 
{%column:price<add:10>%} 

// with formatNum filter
{%column:price|formatNum<add:column:discount>%} 
{%column:price|formatNum<add:10>%}
```

2. **Subtraction (-)**
Subtract values from another column or a static value.

```
{%column:price<sub:column:discount>%} 
{%column:price<sub:10>%}

// with formatNum filter
{%column:price|formatNum<sub:column:discount>%} 
{%column:price|formatNum<sub:10>%}
```

3. Multiplication (*)
Multiply values from another column or a static value.

```
{%column:price<mult:column:discount>%} 
{%column:price<mult:10>%} 

// with formatNum filter
{%column:price|formatNum<mult:column:discount>%} 
{%column:price|formatNum<mult:10>%} 
```

4. Division (/)
Divide values by another column or a static value.

```
{%column:price<div:column:discount>%} 
{%column:price<div:10>%} 

// with formatNum filter
{%column:price|formatNum<div:column:discount>%} 
{%column:price|formatNum<div:10>%} 
```

5. Subtract as a Percentage (- %)
Subtract a percentage value from another column or a static value.

```
{%column:price<subpub:column:discount>%} 
{%column:price<subpub:10>%} 

// with formatNum filter 
{%column:price|formatNum<subpub:column:discount>%} 
{%column:price|formatNum<subpub:10>%} 
```

---

## Full Usage Example (AutoLoad with API)

```javascript
import AutoLoad from 'renderize/autoload';

const viewContainer = document.getElementById("viewContainer");
const renderize = new AutoLoad(viewContainer);

renderize.config({
  view: "grid",
  perLoad: 20,
  loadingPerLoad: 10,
  gridGap: "20px",
  gridItemMinWidth: "280px",
  position: "CENTER",
  loadingClass: "skeleton",
  autoload: true,
  autoloadWhen: 5,
  autoloadMargin: "100px",
  autoFetch: false,
  fetchedDataLength: 20,
  dataApiUrl: "https://api.example.com/products",
  dataBody: {
    page: "{nextPage}",
    limit: 20,
  },
  apiSearching: true,
  searchApiUrl: "https://api.example.com/products/search",
  searchBody: { limit: 20 },
  autoCleanupWhen: 100,
  debug: false,
});

renderize.gridItemTemplate = `<div class="card" style="position:relative;">
  <span data-placeholder data-height="200px">
    {{loadimage|200px|<img src="{%column:thumbnail%}" class="card-img-top" alt="Product">}}
  </span>
  <div class="card-body">
    <h5 class="card-title" data-placeholder data-width="70%">{%column:title|length:30%}...</h5>
    <p class="price" data-placeholder data-width="60px">$\{%column:price%}</p>
    <button class="btn btn-primary" data-placeholder>Add to Cart</button>
  </div>
</div>`;

// Show skeleton loading before data arrives
renderize.loading();

// Fetch initial data
fetch("https://dummyjson.com/products")
  .then(res => res.json())
  .then(data => {
    renderize.updateData(() => data.products);
    renderize.load();
  });

// Event hooks
renderize.beforeAutofetch = () => {
  renderize.loading();
};

renderize.afterAutofetch = (state, response) => {
  // state = "main" or "search"
  return response.products;
};

// Search with debounce
const searchInput = document.getElementById("searchInput");
let timeout;
searchInput.addEventListener("keyup", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (searchInput.value) {
      renderize.search({ q: searchInput.value, limit: 20, page: "{nextPage}" });
    } else {
      renderize.resetSearch();
    }
  }, 600);
});
```