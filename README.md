
# Renderize

Renderize.js is a JavaScript library that facilitates flexible and dynamic rendering of HTML templates based on a provided array of objects. It supports various rendering types, lazy loading of images, flexible templating options and it offers various configuration options.



## Installation

Install renderize with npm

```bash
  npm i renderize
```

## Include the Renderize library in your project:
#### Import Autoload to use the Autoload feature. 

```javascript
  import AutoLoad from 'renderize/autoload'
```
#### Import Pagination to use the Pagination feature. 
```javascript
  import Pagination from 'renderize/pagination'
```

    
## Getting Started

```html
<div id="viewContainer" ></div>
```

```javascript
// Sample data
let data = [
  { /* ... */ },
  // Additional data objects
];

// Initialize Renderize
const viewContainer = document.getElementById("viewContainer")
const renderize = new AutoLoad(data, viewContainer);

// Configure Renderize settings
renderize.config({
  perPage: 20,
  gridGap: "20px",
  // Add other configuration options
});

// Set templates for grid views
renderize.gridItemTemplate = `<div class="card">{/* ... */}</div>`;
// Render HTML 
renderize.render();
// Set templates for list and table views
renderize.listItemTemplate = `<div class="card">{/* ... */}</div>`;
renderize.tableRowHtml = `<tr>{/* ... */}</tr>`;

// For Errors
console.log(renderize.errors);
```
## Configuration Options for both AutoLoad and Pagination

### Grid View Configuration:
1. gridGap: Gap between grid items. Default is '10px'.
2. gridItemMinWidth: Minimum width of grid items. Default is '200px'.
3. gridItemWidth: Width of grid items or "fit" for dynamic width. Default is 'fit'.

### List View Configuration:
1. listGap: Gap between list items. Default is '10px'.
2. listItemMinWidth: Minimum width of list items. Default is '500px'.
3. listItemWidth: Width of list items or "fit" for dynamic width. Default is 'fit'.

### Positioning:
1. position: Position of the view (grid/list) within the container. Default is renderize.POSITIONS.LEFT. Position does not work with fit width.

### Search Configuration:
1. searchIn: Column to search in. Default is 'all'.
2. searchCaseSensitive: Whether the search is case-sensitive. Default is false.
3. apiSearching: Enable searching through an API. Default is false.
4. searchApi: API endpoint for searching. Default is an empty string.
5. searchApiOptions: Fetch API Options. Default is Object. example : { headers: {"Content-Type": "application/json"} }.

### Auto-fetch Configuration:
1. autoFetch: Whether to fetch more data after rendering. Default is false.
2. autoFetchWhen: Number of items remaining before triggering auto-fetch. Default is 40.
3. dataApiUrl: API endpoint for fetching additional data. Default is an empty string.
4. dataApiOptions: Fetch API Options. Default is Object. example : { headers: {"Content-Type": "application/json"} }.

### Lazy Loading Image:
1. lazyloadImageColor: Background color for lazy-loaded images. Default is 'linear-gradient(45deg, white 0%, black 59%)'.


## Configuration Options for AutoLoad. 

### Auto-loading Configuration:
1. autoload: Whether to load more data automatically. Default is false.
2. autoloadWhen: Number of items remaining before triggering autoload. Default is 5 means fifth last.
3. perLoad: Number of items per load. Default is 20.

### Auto-cleaning Configuration:
1. autoCleanupWhen: When a container exceeds (autoCleanupWhen / 100) elements, the previous view container will be emptied when the view is changed.  Default is 100.
## Configuration Options for Pagination. 

### Pagination:
1. perPage: Number of items per page. Default is 20.

### Animation:
1. animation: Apply animation effect. Default is false.there are 2 types of animations "slide" and "fade"
3. animationDuration: Duration of the animation. The default is '.5s' and the css variable --animation-duration in the animations.css file should also be set to animationDuration.


## APIs Placeholders

### For dataApiUrl:
1. {last:index} or {last}: Represents the last index fetched, allowing you to fetch data starting from the last index. For example, if the last index is 40, it will fetch data starting from index 39.

2. {last:counter}: Represents the last counter/row/length fetched, enabling you to fetch data starting from the last counter. For instance, if the last counter is 40, it will fetch data starting from counter 40.

3. {last:column}: Represents the last index column, letting you fetch data starting from the last index column.

4. {perPage}: Represents the number of items per page, helping in paginating the API request. It allows dynamic control over the number of items fetched. for only Pagination

5. {perLoad}: Represents the number of items per load, helping in paginating the API request. It allows dynamic control over the number of items fetched. for only AutoLoad

### For searchApi:
1. {query}: Represents the search query for simple searches.

2. {searchCaseSensitive}: Represents whether the search is case-sensitive. It returns true or false.

3. {column}: Represents the column on which the search is performed. It returns the value set in the searchIn configuration.

4. {last:index} or {last}: Represents the last index fetched, allowing you to fetch data starting from the last index. For example, if the last index is 40, it will fetch data starting from index 39.

5. {last:counter}: Represents the last counter/row/length fetched, enabling you to fetch data starting from the last counter. For instance, if the last counter is 40, it will fetch data starting from counter 40.

6. {last:column}: Represents the last index column, letting you fetch data starting from the last index column.

7. {perPage}: Represents the number of items per page, helping in paginating the API request. It allows dynamic control over the number of items fetched. for only Pagination

8. {perLoad}: Represents the number of items per load, helping in paginating the API request. It allows dynamic control over the number of items fetched. for only AutoLoad

## Templating Engine

### One-time Parse Placeholders ({{}}):
1. {{date:d}}: Parse the current day of the month (e.g., 30).
2. {{date:m}} : Parse the current month (e.g., 6).
3. {{date:y}} : Parse the current year (e.g., 2023).
4. {{time:h}} : Parse the current hour (e.g., 3).
5. {{time:m}} : Parse the current minute (e.g., 43).
6. {{time:s}} : Parse the current second (e.g., 30).
7. {{loadimage|height|width?optional|img_tag}} : Lazy loads an image with specified height and width. width is optional

### Parse for Every Row Placeholders ({%%}):
1. {%column:column_name%} : Parse the value of the specified column.
2. {%column:column_name[key]%} : Parse the value of a key within a column if the column is an array or object.
3. {%column:column_name|upper%} : Capitalizes all letters in the column value.
4. {%column:column_name|lower%} : Converts all letters in the column value to lowercase.
5. {%column:column_name|firstCap%} : Capitalizes the first letter of the column value.
6. {%column:title|length:20%} : Limits the length of the column value to 20 characters.
7. {%column:column_name|formatNum%} : Formats the column value as a number with commas (e.g., 100000 becomes 100,000).
8. {%counter%} : The counter is number of current iteration.

### Conditional Rendering:


#### Description
Conditional rendering is performed with column only and without the comparison, logical, bitwise operator. else statement is required

#### Code

```javascript
{%if column:column_name %}
  <button class="btn-sm btn-primary">Add</button>
{%else%}
  <button class="btn-sm btn-danger">Delete</button>
{%endif%}
```

### Lazy Load Image Examples:
1. {{loadimage|40px|40px|<img ...>}} : Lazy loads an image with a specified height and width (40px x 40px) using an img tag.
2. {{loadimage|40px|<img ...>}} : Lazy loads an image with a specified height (40px) and uses an img tag.

### Template Example:
```javascript
// Example data 
data = [
  { img: "example.png", title: 'Example Title', price: '120000', rating: 5, brand: "example", discount: "30%",liked:true},
]
// Set template for grid views
dataView.gridItemTemplate = `<div class="card custom-card">
<span class="badge bg-primary" style="position: absolute;top: 10px;right: 10px;">{%counter%}</span>

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
```

## Constructors
#### Pagination Constructor

## new Pagination(Data, Container)

#### Parameters
1. Data (Array): An array of objects representing the data to be displayed.
2. Container (HTMLElement): The HTML element that will serve as the container for the Renderize.

#### Description
Initializes a new Pagination Functionality.

#### Code

```javascript
const renderize = new Pagination(data, container);
```

#### AutoLoad Constructor

## new AutoLoad(Data, Container)

#### Parameters
1. Data (Array): An array of objects representing the data to be displayed.
2. Container (HTMLElement): The HTML element that will serve as the container for the Renderize.

#### Description
Initializes a new AutoLoad Functionality.

#### Code

```javascript
const renderize = new AutoLoad(data, container);
```

## Methods for both AutoLoad and Pagination

## config(Options)

#### Parameters
1. Options (Object): An object containing configuration options for the Renderize.

#### Description
Configures various options for the Rendering, allowing customization of its behavior.


#### Code

```javascript
renderize.config({
  autoload: true,
  autoFetch: true,
  dataApiUrl: "https://api.example.com",
  animation: "fade",
  // Other options...
});
```

## render(View)

#### Parameters
1. View (String): The view to set for rendering data (e.g., "grid", "list", "table"). Default is "grid"


#### Description
Render the data.     

#### Code

```javascript
renderize.render();
```

## gridItemTemplate(Html)

#### Parameters
1. Html (String): The HTML template for each grid item. 

#### Type
Setter

#### Description
Sets the template for grid items, allowing customization of the visual representation.


#### Code

```javascript
renderize.gridItemTemplate = `<div class="card"> ... </div>`;
```



## listItemTemplate(Html)

#### Parameters
1. Html (String): The HTML template for each list item.

#### Type
Setter

#### Description
Sets the template for list items, providing flexibility in defining the appearance.


#### Code

```javascript
renderize.listItemTemplate = `<div class="card"> ... </div>`;
```



## tableRowHtml(Html)

#### Parameters
1. Html (String): The HTML template for each table row.

#### Type
Setter

#### Description
Sets the HTML template for table rows, allowing customization of the table layout.

#### Code

```javascript
renderize.tableRowHtml = `<div class="card"> ... </div>`;
```


## tableColumns(Array)

#### Parameters
1. Array (Array): Array for Table Headings.

#### Type
Setter

#### Description
Sets the Table Headings, allowing customization of the table headings.

#### Code

```javascript
renderize.tableColumns = ["S.no","Name"];
```


## view(View)

#### Parameters
1. View (String): The view to set for rendering data (e.g., "grid", "list", "table").

#### Type
Setter

#### Description
Changes the view mode for rendering data.

#### Code

```javascript
renderize.view = "grid";
```


## search(Query)

#### Parameters
1. Query (String): The search query.


#### Description
Searches for data based on the provided query, updating the displayed results in smartway.


#### Code

```javascript
renderize.search("example");
```


## afterSearching(response)

#### Parameters
1. response (Json): the response which is fetched from API.

#### Description
This is an event.The afterSearching will trigger after receiving a response from the search API.
Return is necessary

#### Code
```javascript
renderize.afterSearching = (response) => {=
  console.log("Searched.");

  // response = {
  //   success:true,
  //   data:[
  //     { /* ... */ },
  //   ]
  // }
  // if your data is like this then return response.data
  // Because as you know only array object is allowed.

  return response;
};
```

## startSelection(Callback,Options)

#### Parameters
1. Callback (Function): A callback function to handle selected items.
2. Options (Object): Options to set checkbox


#### Description
Initiates the selection mode, allowing users to interactively select items and perform operations like multi delete.

#### Code

```javascript
renderize.startSelection((currentElement) => {
  // Handle selected items...
},{
    top:"auto", // To set the top position of the checkbox
    right:"7px", // To set the right position of the checkbox
    bottom:"7px", // To set the bottom position of the checkbox
    left:"auto", // To set the left position of the checkbox
    class:"selectionCheckbox" // To set the class on the checkbox. Default is selection
});
```

## stopSelection()


#### Description
Exits the selection mode, concluding the interactive selection process.


#### Code

```javascript
renderize.stopSelection();
```



## Methods for Pagination

## perPage(Value)

#### Parameters
1. Value (Number): The number of items to display in per page.

#### Type
Setter

#### Description
Sets the number of items to display in per page.


#### Code

```javascript
renderize.perPage = 30;
```


## totalPages()

#### Type
Getter

#### Description
Gets the total number of pages.


#### Code

```javascript
const total = renderize.totalPages;
```


## currentPage()

#### Type
Getter

#### Description
Gets the current page number.

#### Code

```javascript
const current = renderize.currentPage;
```


## nextPage()


#### Description
Moves to the next page, updating the display accordingly.


#### Code

```javascript
renderize.nextPage();
```

## previousPage()

#### Description
Moves to the previous page, adjusting the displayed content.


#### Code

```javascript
renderize.previousPage();
```



## jumpToPage(PageNumber)

#### Parameters
1. PageNumber (Number): The page number to jump to.


#### Description
Jumps to the specified page, facilitating quick navigation.


#### Code

```javascript
renderize.jumpToPage(3);
```


## Methods for AutoLoad

## beforeAutoload()

#### Description
This is an event.The beforeAutoload will trigger before more elements are loaded.

#### Code

```javascript
renderize.beforeAutoload = () => {
  loaderContainer.classList.remove("hidden")
  console.log("Loading more elements...");
};
```

## afterAutoload()

#### Description
This is an event.The afterAutoload will trigger after more elements are loaded.

#### Code

```javascript
renderize.afterAutoload = () => {
  loaderContainer.classList.add("hidden")
  console.log("More elements are loaded.");
};
```

## beforeAutofetch()

#### Description
This is an event.The beforeAutofetch will trigger before requesting more data..

#### Code

```javascript
renderize.beforeAutofetch = () => {
  loaderContainer.classList.remove("hidden")
  console.log("Fetching more elements...");
};
```

## afterAutofetch(response)

#### Parameters
1. response (Json): the response which is fetched from API.

#### Description
This is an event.The afterAutofetch will trigger after fetching more data.
Return is necessary

#### Code

```javascript
renderize.afterAutofetch = (response) => {
  loaderContainer.classList.add("hidden")
  console.log("More elements are loaded.");

  // response = {
  //   success:true,
  //   data:[
  //     { /* ... */ },
  //   ]
  // }
  // if your data is like this then return response.data
  // Because as you know only array object is allowed.

  return response;
};
```


## Templator Class

### Overview
The Templator class in Renderize enables users to create custom templators, allowing for a highly flexible and customizable rendering process. Templators define functions that influence the parsing and rendering of data rows.

## Constructor

## constructor(TemplatingBasicMethods)

#### Parameters
1. TemplatingBasicMethods (Object): An object containing basic templating methods for rendering.

#### Description
The Templator constructor initializes an instance of the custom templator class. It requires an object, TemplatingBasicMethods, which provides fundamental templating methods for use within the templator.


#### Code

```javascript
// Custom templator class definition
class Templator {
    #templatingBasicMethods;

    // Constructor for the Templator class
    constructor(TemplatingBasicMethods) {
        // Initialize TemplatingBasicMethods for use within the class
        this.#templatingBasicMethods = TemplatingBasicMethods;
    }

    // ... (other methods)
}

```



## Methods


## oneTimeParse(Template)

#### Parameters
1. Template (String): The HTML template.


#### Description
This function is called only once during the initialization of the template. It provides an opportunity to modify or enhance the template globally before the rendering process begins.


#### Return
String: The HTML template.


#### Code

```javascript
class MyTemplator {
  oneTimeParse(template) {
    // Modify the template
    return template;
  }
}

renderize.register.templator(MyTemplator());
```


## parseOnEveryRow(Template, Data, RowNumber)

#### Parameters
1. Template (String): The HTML template for a single row.
2. Data (Object): The data for the current row.
3. RowNumber (Number): The number of the current row in the dataset.


#### Description
This function is called for every row in the dataset. It allows dynamic modification of the template based on the specific data and row information.


#### Return
String: The modified HTML template for the current row.

#### Code

```javascript
class MyTemplator {
  parseOnEveryRow(template, data, rowNumber) {
    // Modify the template based on data or rowNumber
    return template;
  }
}

renderize.register.templator(MyTemplator());
```

## Registering a Templator
Before setting the item templates (gridItemTemplate, listItemTemplate, tableRowHtml), it is crucial to register the custom templator class. The registration ensures that the oneTimeParse method is called appropriately during the template setup.

#### Example

```javascript
// Example of custom templator class
export class MyTemplator {
    oneTimeParse(template) {
        // Modify the template
        return template;
    }
    parseOnEveryRow(template, data, rowNumber) {
        // Modify the template based on data or rowNumber
        return template;
    }
}

// Register the custom templator before setting the templates
renderize.register.templator(MyTemplator());

// Set the templates
renderize.gridItemTemplate = `<div class="card"> ... </div>`;
renderize.render()
```

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
            const data = parseInt(Data[column].replace(",",''));
            if (value=="column") {value = Data[operationByColumn]}
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
            if (formate=="formateNum") {
                returnValue = this.#templatingBasicMethods.formateNum(returnValue)                    
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
import { Templator } from "./Templators/ArithmeticTemplator.js"; // replace with your actual Templator path

// Sample data
let data = [
  { /* ... */ },
  // Additional data objects
];

// Initialize Renderize
const viewContainer = document.getElementById("viewContainer")
const renderize = new AutoLoad(data, viewContainer);

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
console.log(renderize.errors);
```
