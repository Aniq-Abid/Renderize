class Pagination {
    #data = [{}];
    #renderData;
    #templator = null;
    #mainContainer;
    #viewContainer;
    #view;
    // grid
    #gridContainer;
    #gridGap;
    #gridItemWidth;
    #gridItemMinWidth;
    #gridItemHtml = null;
    #gridItemTagName = null;
    // table
    #tableContainer;
    #tableColumns = [];
    #tableRowHtml = null;
    // list
    #listContainer;
    #listGap;
    #listItemWidth;
    #listItemMinWidth;
    #listItemHtml = null;
    #listItemTagName = null;
    // Search
    #searchContainer
    #searchContainerReConfig = true
    //
    #renderState = "main" // search
    #firstRenderRow = 0;
    #lastRenderRow = 0;
    #searchFirstRenderRow = 0
    #searchLastRenderRow = 0
    #currentPage = 1;
    #searchCurrentPage = 1;
    #perPage
    #totalPages
    #searchTotalPages
    #reRenderGrid = true
    #reRenderList = true
    #reRenderTable = true
    #lazyloadImageColor
    // animations
    #animation
    #animationOn = null
    #animationDuration
    // 
    #position
    // 
    #autoFetch
    #autoFetchWhen
    // observers
    #imgObserver
    #errors = []
    constructor(Data, Container) {
        this.#mainContainer = Container
        this.#mainContainer.style.overflow = "hidden"
        if (!Array.isArray(Data)) {
            this.#errors.push("Invalid Data | Data is Not An Array | Data must be Array Object")
        } else if (Object.prototype.toString.call(Data[0]) !== '[object Object]') {
            this.#errors.push("Invalid Data | Data is Not An Array Object | Data must be Array Object")
        } else {
            this.#data = Data
            this.dataLength = this.#data.length
        }
        // positions 
        this.POSITIONS = {
            LEFT: "justify-content: flex-start;",
            RIGHT: "justify-content: flex-end;",
            CENTER: "justify-content: center;",
            BETWEEN: "justify-content: space-between;",
            AROUND: "justify-content: space-around;",
            EVENLY: "justify-content: space-evenly;"
        }
    }
    config(Options = {}) {
        this.#renderData = this.#data
        this.#perPage = Options.perPage || 20;
        this.#lazyloadImageColor = Options.lazyloadImageColor || "#eee";
        // grid
        this.#gridGap = Options.gridGap || "10px";
        this.#gridItemMinWidth = Options.gridItemMinWidth || '200px';
        this.#gridItemWidth = Options.gridItemWidth || 'fit';
        if (Options.gridItemMinWidth && Options.gridItemMinWidth.endsWith("%")) { this.errors.push("In gridItemMinWidth % percentage is not allowed") }
        if (Options.gridItemWidth && Options.gridItemWidth.endsWith("%")) { this.errors.push("In gridItemWidth % percentage is not allowed") }
        // list
        this.#listGap = Options.listGap || "10px";
        this.#listItemMinWidth = Options.listItemMinWidth || '500px';
        this.#listItemWidth = Options.listItemWidth || 'fit';
        if (Options.listItemMinWidth && Options.listItemMinWidth.endsWith("%")) { this.errors.push("In listItemMinWidth % percentage is not allowed") }
        if (Options.listItemWidth && Options.listItemWidth.endsWith("%")) { this.errors.push("In listItemWidth % percentage is not allowed") }
        // search
        this.searchIn = Options.searchIn || "all";
        this.searchCaseSensitive = Options.searchCaseSensitive || false;
        this.#searchContainer = document.createElement('div');
        this.#searchContainer.id = 'ViewSearchContainer';
        this.#mainContainer.append(this.#searchContainer);
        // 
        this.#animation = Options.animation || false;
        this.#animationDuration = Options.animationDuration?.slice(0, -1) || '.5'
        // 
        this.#position = Options.position || this.POSITIONS.LEFT;
        // 
        this.#totalPages = this.#calculateTotalPages();
        this.columns = Object.keys(this.#data[0]);
        this.selected = [];
        this.inSelection = false;
        this.#currentPage = 1;
        this.#firstRenderRow = 0;
        this.#lastRenderRow = 0
        // 
        this.#templator = new Templator({
            "lazyloadImageColor": this.#lazyloadImageColor
        });
        // Image Observer for lazy load images
        this.#imgObserver = new IntersectionObserver((images) => {
            const length = images.length;
            for (let index = 0; index < length; index++) {
                if (images[index].isIntersecting) {
                    const img = images[index].target;
                    img.src = img.dataset.viewLoadimg
                    img.style.visibility = "visible"
                    // Remove the observer after loading the image
                    this.#imgObserver.unobserve(img);
                }
            }
        }, { rootMargin: "120px" });
        // time out | set these configuration after few seconds
        setTimeout(() => {
            // Search
            this.#searchContainer.style.display = "grid";
            this.#searchContainer.style.position = "relative";
            this.apiSearching = Options.apiSearching || false;
            this.searchApi = Options.searchApi || ""
            this.searchApiOptions = Options.searchApiOptions || {}
            if (this.apiSearching) {
                if (this.searchApi == "") { this.#errors.push("Search API Url not provided for fetching data."); }
                else if (typeof this.searchApi != 'string') { this.#errors.push("Invalid Search API Url"); }
                else if (!this.searchApi.startsWith("http") && !this.searchApi.startsWith("https")) { this.#errors.push("Invalid Search API Url .Protocol not Provided"); }
            }
            // autoFetch
            this.#autoFetch = Options.autoFetch || false;
            this.#autoFetchWhen = Options.autoFetchWhen || 40;
            this.dataApiUrl = Options.dataApiUrl || "";
            this.dataApiOptions = Options.dataApiOptions || {};
            if (this.#autoFetch) {
                if (this.dataApiUrl == "") { this.#errors.push("Data API Url not provided for fetching data."); }
                else if (typeof this.dataApiUrl != 'string') { this.#errors.push("Invalid Data API Url"); }
                else if (!this.dataApiUrl.startsWith("http") && !this.dataApiUrl.startsWith("https")) { this.#errors.push("Invalid Data API Url .Protocol not Provided"); }
            }
            // 
            window.addEventListener("resize", () => {
                if (this.#viewContainer == this.#gridContainer) {
                    this.#gridStyle();
                } else if (this.#viewContainer == this.#listContainer) {
                    this.#listStyle()
                }
            });
        }, 500);
    }
    get totalPages() {
        let totalPages;
        if (this.#renderState == "main") {
            totalPages = this.#totalPages;
        } else if (this.#renderState == "search") {
            totalPages = this.#searchTotalPages;
        }
        return totalPages;
    }
    get currentPage() {
        let current;
        if (this.#renderState == "main") {
            current = this.#currentPage;

        } else if (this.#renderState == "search") {
            current = this.#searchCurrentPage;
        }
        return current
    }
    get errors() {
        return this.#errors;
    }
    get register() {
        const _this = this;
        return {
            templator(Templator) {
                _this.#templator.register(Templator)
            }
        }
    }
    /**
     * @param {null} Html
     */
    set listItemTemplate(Html) {
        if (this.#errors.length > 0) { return }
        Html = Html.trim()
        if (!Html.startsWith("<")) { this.#errors.push("Invalid List Item Template"); return "" }
        // Find the position of the opening bracket and the first space to extract the tag
        const openBracketIndex = Html.indexOf('<');
        const firstSpaceIndex = Html.indexOf(' ', openBracketIndex);
        // Determine the end index based on whether there is a space after the tag
        const endTagIndex = (firstSpaceIndex !== -1) ? firstSpaceIndex : Html.indexOf('>', openBracketIndex);
        // Extract the tag name
        let tagname = Html.slice(openBracketIndex + 1, endTagIndex).toLowerCase();
        tagname = tagname.lastIndexOf('>')!=-1?tagname.slice(0,-2):tagname
        if (!Html.endsWith(`</${tagname}>`)) { this.#errors.push("Invalid List Item Template"); return "" }
        this.#listItemTagName = tagname;
        this.#listItemHtml = this.#templator.oneTimeParse(Html);
        // 
        this.#listContainer = document.createElement('div');
        this.#listContainer.id = 'ViewListContainer';
        this.listContainerClass = 'data-view-list';
        this.#listContainer.className = this.listContainerClass;
        this.#listContainer.style.display = "none";
        this.#listContainer.style.gap = this.#listGap;
        this.#listContainer.style.position = "relative";
        this.#mainContainer.append(this.#listContainer);
        this.#listStyle()
    }
    /**
     * @param {string} Html
     */
    set gridItemTemplate(Html) {
        if (this.#errors.length > 0) { return }
        Html = Html.trim()
        if (!Html.startsWith("<")) { this.#errors.push("Invalid Grid Item Template"); return "" }
        // Find the position of the opening bracket and the first space to extract the tag
        const openBracketIndex = Html.indexOf('<');
        const firstSpaceIndex = Html.indexOf(' ', openBracketIndex);
        // Determine the end index based on whether there is a space after the tag
        const endTagIndex = (firstSpaceIndex !== -1) ? firstSpaceIndex : Html.indexOf('>', openBracketIndex);
        // Extract the tag name
        let tagname = Html.slice(openBracketIndex + 1, endTagIndex).toLowerCase();
        tagname = tagname.lastIndexOf('>')!=-1?tagname.slice(0,-2):tagname
        if (!Html.endsWith(`</${tagname}>`)) { this.#errors.push("Invalid Grid Item Template"); return "" }
        this.#gridItemTagName = tagname;
        this.#gridItemHtml = this.#templator.oneTimeParse(Html);
        // 
        this.#gridContainer = document.createElement('div');
        this.#gridContainer.id = 'ViewGridContainer';
        this.gridContainerClass = 'data-view-grid';
        this.#gridContainer.className = this.gridContainerClass;
        this.#gridContainer.style.display = 'none';
        this.#gridContainer.style.gap = this.#gridGap;
        this.#gridContainer.style.position = "relative";
        this.#mainContainer.append(this.#gridContainer);
        this.#gridStyle();
    }
    /**
     * @param {string} Html
     */
    set tableRowHtml(Html) {
        if (this.#errors.length > 0) { return }
        Html = Html.trim()
        if (!Html.startsWith("<")) { this.#errors.push("Invalid Table Row Template"); return "" }
        this.#tableRowHtml = this.#templator.oneTimeParse(Html);
        // 
        this.#tableContainer = document.createElement('table');
        this.#tableContainer.id = 'ViewTableContainer';
        this.#tableContainer.style.position = "relative";
        this.tableClass = 'data-view-table table';
        this.#tableContainer.className = this.tableClass;
        this.#tableContainer.createTBody();
        this.#tableContainer.style.display = 'none';
        this.#mainContainer.append(this.#tableContainer);
    }
    /**
     * @param {array} Array
     */
    set tableColumns(Array) {
        if (this.#tableRowHtml == null) { this.#errors.push("Please Set Table Row Template First."); return null; }
        this.#tableColumns = Array
        let tHead = this.#tableContainer.createTHead();
        let tableHeadings = "<tr>";
        for (let index = 0; index < this.#tableColumns.length; index++) {
            tableHeadings += `<th>${this.#tableColumns[index]}</th>`;
        }
        tableHeadings += "</tr>";
        tHead.innerHTML = tableHeadings
    }
    /**
     * @param {string} Value
     */
    set perPage(Value) {
        this.#perPage = parseInt(Value)
        this.#totalPages = this.#calculateTotalPages()
        const firstRenderRow = this.#firstRenderRow
        if (firstRenderRow + this.#perPage > this.dataLength || firstRenderRow < this.#perPage) {

            this.#firstRenderRow = 0;

            this.#currentPage = 1;

        } else {
            this.#currentPage = 1;
            
            for (let index = 0; index < this.#firstRenderRow; index += this.#perPage) {
                if (index + this.#perPage > this.#firstRenderRow) {
                    this.#firstRenderRow = index
                } else {
                    this.#currentPage++;
                }
            }
        }
        this.#lastRenderRow = this.#firstRenderRow;
        this.#reRenderGrid = true;
        this.#reRenderList = true;
        this.#reRenderTable = true;
        this.#rendering();
    }
    /**
     * @param {string} View
     */
    set view(View) {
        if (this.inSelection) { return "You are in Selection Mode"; }
        this.#view = View;
        if (this.#renderState == 'search') {
            if (this.#view == "table") {
                this.#searchContainer.style.display = "none";
                this.#viewContainer = this.#tableContainer;
                this.#viewContainer.style.display = "table";
            } else {
                this.#tableContainer.style.display = "none";
                this.#searchContainerConfig(this.#view);
                this.#viewContainer = this.#searchContainer;
                this.#viewContainer.style.display = "grid";
            }
            this.#searchFirstRenderRow = 0;
            this.#searchLastRenderRow = 0;
            this.#searchCurrentPage = 1;
            this.#rendering();
            return;
        }
        switch (View) {
            case "grid":
                if (this.#gridItemHtml == null) { this.#errors.push("Please Set Grid Item Template First."); return null; }
                if (this.#listContainer) {
                    this.#listContainer.style.display = "none"
                }
                if (this.#tableContainer) {
                    this.#tableContainer.style.display = "none"
                }
                this.#gridContainer.style.display = "grid";
                this.#viewContainer = this.#gridContainer

                if (this.#reRenderGrid) {
                    this.#lastRenderRow = this.#firstRenderRow;
                    this.#rendering();
                }
                this.#searchContainerReConfig = true
                break;
            case "list":
                if (this.#listItemHtml == null) { this.#errors.push("Please Set List Item Template First."); return null; }

                if (this.#gridContainer) {
                    this.#gridContainer.style.display = "none"
                }
                if (this.#tableContainer) {
                    this.#tableContainer.style.display = "none"
                }
                this.#listContainer.style.display = "grid";
                this.#viewContainer = this.#listContainer;

                if (this.#reRenderList) {
                    this.#lastRenderRow = this.#firstRenderRow;
                    this.#rendering();
                }
                this.#searchContainerReConfig = true
                break;
            case "table":
                if (this.#tableRowHtml == null) { this.#errors.push("Please Set Table Row Template First."); return null; }

                if (this.#gridContainer) {
                    this.#gridContainer.style.display = "none"
                }
                if (this.#listContainer) {
                    this.#listContainer.style.display = "none"
                }
                this.#tableContainer.style.display = "table"
                this.#viewContainer = this.#tableContainer;

                if (this.#reRenderTable) {
                    this.#lastRenderRow = this.#firstRenderRow;
                    this.#rendering()
                }
                break;
        }
    }
    async search(Query) {
        if (this.inSelection) { return "You are in Selection Mode"; }
        if (Query == "") {
            if (this.#view == "grid") { this.#viewContainer = this.#gridContainer; this.#gridContainer.style.display = "grid" }
            else if (this.#view == "list") { this.#viewContainer = this.#listContainer; this.#listContainer.style.display = "grid" }
            else if (this.#view == "table") { this.#viewContainer = this.#tableContainer; this.#tableContainer.style.display = "table" }
            this.#searchContainer.style.display = "none";
            this.#renderData = this.#data;
            this.#searchCurrentPage = 1;
            this.#renderState = "main";
            if (this.#reRenderGrid || this.#reRenderList || this.#reRenderTable) {
                this.#lastRenderRow = this.#firstRenderRow;
                this.#rendering();
            }
            this.#searchContainer.innerHTML = "";
            this.searchQuery = null;
            return;
        }

        if (this.#searchContainerReConfig) {
            this.#searchContainerReConfig = false;
            this.#searchContainerConfig();
        }
        if (this.apiSearching) {
            const url = this.searchApi.replace(/{(.*?)}/g, (match, placeholder) => {
                if (placeholder == "query") {
                    return Query;
                } else if (placeholder == "searchCaseSensitive") {
                    return this.searchCaseSensitive;
                } else if (placeholder == "column") {
                    return this.searchIn;
                }
                // 
                if (placeholder == "last") {
                    return this.dataLength - 1
                } else if (placeholder == "last:index") {
                    return this.dataLength - 1
                } else if (placeholder == "last:counter") {
                    return this.dataLength
                } else if (placeholder.startsWith("last:")) {
                    return this.#data[this.dataLength - 1][placeholder.slice(5)]?.toString().replace(/ /g, "%20");
                }
                else if (placeholder == "perPage") {
                    return this.#perPage
                }
            });
            let data = await fetch(url, this.searchApiOptions);
            try {
                data = await data.json();
                if (this.afterSearching) {
                    this.#renderData = this.afterSearching(data)
                } else {
                    this.#renderData = data;
                }
            } catch (error) {
                if (this.afterSearching) {
                    this.errors.push(error)
                    this.afterSearching(error)
                }
            }
        } else {
            this.#renderData = this.#data.filter((Value) => {
                if (this.searchIn == "all") {
                    if (this.searchCaseSensitive) {
                        return JSON.stringify(Value).includes(Query);
                    } else {
                        return JSON.stringify(Value).toLowerCase().includes(Query.toLowerCase());
                    }
                } else {
                    if (this.searchCaseSensitive) {
                        return String(Value[this.searchIn]).includes(Query);
                    } else {
                        return String(Value[this.searchIn]).toLowerCase().includes(Query.toLowerCase());
                    }
                }
            });
        }
        if (this.#viewContainer != this.#searchContainer) {
            if (this.#view == "grid") { this.#gridContainer.style.display = "none" }
            else if (this.#view == "list") { this.#listContainer.style.display = "none" }
            else if (this.#view == "table") { this.#tableContainer.style.display = "none" }
            if (this.#view == "table") {
                this.#viewContainer = this.#tableContainer;
                this.#viewContainer.style.display = "table";
            } else {
                this.#viewContainer = this.#searchContainer;
                this.#viewContainer.style.display = "grid";
            }
        }
        this.#searchFirstRenderRow = 0;
        this.#searchLastRenderRow = 0;
        this.#searchCurrentPage = 1;
        this.#renderState = "search";
        this.#rendering();
        this.searchQuery = Query;
        this.#searchTotalPages = this.#calculateTotalPages();
    }
    render(View = "grid") {
        this.#view = View;
        switch (View) {
            case "grid":
                if (this.#gridItemHtml == null) { this.#errors.push("Please Set Grid Item Template First."); return null; }
                this.#gridContainer.style.display = 'grid';
                this.#viewContainer = this.#gridContainer;
                break;
            case "list":
                if (this.#listItemHtml == null) { this.#errors.push("Please Set List Item Template First."); return null; }
                this.#listContainer.style.display = 'grid';
                this.#viewContainer = this.#listContainer;
                break;
            case "table":
                if (this.#tableRowHtml == null) { this.#errors.push("Please Set Table Row Template First."); return null; }
                if (this.#tableContainer.tHead == null) { this.#errors.push("Please Set Table Headings First With tableColumns Which Is Setter Method.");}

                this.#tableContainer.style.display = "table"
                this.#viewContainer = this.#tableContainer;
                this.#searchContainerReConfig = false;
                break;
        }
        this.#rendering();
    }
    async #fetchData() {
        let lastRenderRow;
        let dataLength;
        let apiUrl;
        if (this.#renderState == "main") {
            lastRenderRow = this.#lastRenderRow;
            dataLength = this.dataLength;
            apiUrl = this.dataApiUrl;
        } else {
            lastRenderRow = this.#searchLastRenderRow;
            dataLength = this.#renderData.length;
            apiUrl = this.searchApi.replace(/{(.*?)}/g, (match, placeholder) => {
                if (placeholder == "query") {
                    return this.searchQuery;
                } else if (placeholder == "searchCaseSensitive") {
                    return this.searchCaseSensitive;
                } else if (placeholder == "column") {
                    return this.searchIn;
                }
            });
        }
        if ((dataLength - (lastRenderRow + 1) <= this.#autoFetchWhen) && dataLength >= this.#perPage) {
            if (this.beforeAutofetch) {
                this.beforeAutofetch();
            }
            const url = apiUrl.replace(/{(.*?)}/g, (match, placeholder) => {
                if (placeholder == "last") {
                    return this.dataLength - 1
                } else if (placeholder == "last:index") {
                    return this.dataLength - 1
                } else if (placeholder == "last:counter") {
                    return this.dataLength
                } else if (placeholder.startsWith("last:")) {
                    return this.#data[this.dataLength - 1][placeholder.slice(5)]?.toString().replace(/ /g, "%20");
                }
                else if (placeholder == "perPage") {
                    return this.#perPage
                }
            });
            let data = await fetch(url, this.dataApiOptions);
            try {
                data = await data.json();
                let newData;
                if (this.afterAutofetch) {
                    newData = this.afterAutofetch(data)

                } else {
                    newData = data
                }
                if (this.#renderState == "main") {
                    this.#data = this.#data.concat(newData);
                    this.#renderData = this.#data;
                } else {
                    this.#renderData = this.#renderData.concat(newData);
                }
                if (this.#renderState == 'main') { 
                    this.#totalPages = this.#calculateTotalPages();
                    this.dataLength += newData.length

                } else {
                    this.#searchTotalPages = this.#calculateTotalPages();
                }
            } catch (error) {
                if (this.afterAutofetch) {
                    this.afterAutofetch(error)                
                }
                this.errors.push(error)
            }
        }
    }

    #rendering(newInsert = true) {
        if (this.errors.length > 0) { return; }
        let itemHtml;
        let firstRow;
        let lastRow;
        if (this.#renderState == "main") {
            if (newInsert) {
                firstRow = this.#firstRenderRow;
            } else {
                firstRow = ++this.#lastRenderRow;
            }
            lastRow = this.#lastRenderRow;
        } else if (this.#renderState == "search") {
            if (newInsert) {
                firstRow = this.#searchFirstRenderRow;
            } else {
                firstRow = ++this.#searchLastRenderRow;
            }
            lastRow = this.#searchLastRenderRow;
        }
        if (this.#view == "grid") {
            if (this.#gridItemHtml == null) { this.#errors.push("Please Set Grid Item Template First."); return null; }
            itemHtml = this.#gridItemHtml;
        } else if (this.#view == "list") {
            if (this.#listItemHtml == null) { this.#errors.push("Please Set List Item Template First."); return null; }
            itemHtml = this.#listItemHtml;
        } else if (this.#view == "table") {
            if (this.#tableRowHtml == null) { this.#errors.push("Please Set Table Row Template First."); return null; }
            itemHtml = this.#tableRowHtml;
        }
        let numberOfRows = this.#perPage + lastRow;
        let index;
        const fragment = document.createDocumentFragment();
        const element = document.createElement("tbody");
        for (index = firstRow; index < numberOfRows; index++) {
            if (this.#renderData[index] == undefined) { break; }
            element.insertAdjacentHTML("beforeend", this.#templator.parseOnEveryRow(itemHtml, this.#renderData[index], index));
            fragment.appendChild(element.firstChild);
        }
        if (this.#renderState == "search") {
            this.#searchLastRenderRow = --index;
        } else {
            this.#lastRenderRow = --index; 
        }

        const append = () => {
            let container = this.#viewContainer
            if (this.#view == "table") {
                container = container.tBodies[0]
            }
            if (newInsert) {
                container.innerHTML = "";
                container.appendChild(fragment);
            } else {
                container.appendChild(fragment);
            }
            setTimeout(() => {
                if (this.#renderState == 'main') {
                    if (this.#view == "grid") {
                        this.#reRenderGrid = false;
                    } else if (this.#view == "list") {
                        this.#reRenderList = false;
                    } else if (this.#view == "table") {
                        this.#reRenderTable = false;
                    }
                } else {
                    if (this.#view == "table") {
                        this.#reRenderTable = true;
                    }
                }
                // 
                const images = document.querySelectorAll(`#${this.#viewContainer.id} img[data-view-loadimg]`);
                const length = images.length;
                for (let index = 0; index < length; index++) {
                    this.#imgObserver.observe(images[index]);
                }
            }, 70);
        }


        if (this.#animation != false && this.#animationOn != null) {
            this.#animator(() => {
                append();
            }, this.#viewContainer)
        } else {
            append();
        }
        if (this.#autoFetch) {
            setTimeout(() => {
                this.#fetchData()
            }, 110);
        }
        if (this.inSelection) {
            setTimeout(() => {
                this.#setupSelection(firstRow,this.#lastRenderRow);
            }, 80);
        }
    }
    #setupSelection(start, end) {
        const options = this.selectionOptions;
        if (this.#viewContainer == this.#tableContainer) {
            const rows = this.#viewContainer.rows;
            if (start == 0) {
                var td = rows[0].insertCell(0);
                td.innerHTML = `<input type="checkbox" class="${options.class}" selection="all">`;
            }
            for (let index = start; index <= end; index++) {
                if (rows[index + 1] == undefined) { break; }
                var td = rows[index + 1].insertCell(0);
                td.innerHTML = `<input type="checkbox" class="${options.class}" selection="${index}">`;
            }
        } else {
            const children = this.#viewContainer.children;
            if (children[start] == undefined) {
                const inputs = this.#viewContainer.querySelectorAll("input[selection]");
                const startIndex = inputs.length
                const last = inputs.length + this.#perPage
                for (let index = startIndex; index <= last; index++) {
                    if (children[index] == undefined) { break; }
                    children[index].insertAdjacentHTML("afterbegin", `<input type="checkbox" class="${options.class}" selection="${index}" style="position: absolute;top: ${options.top};right:${options.right};bottom:${options.bottom};left: ${options.left};z-index: 5;">`)
                }
            } else {
                for (let index = start; index <= end; index++) {
                    if (children[index] == undefined) { break; }
                    children[index].insertAdjacentHTML("afterbegin", `<input type="checkbox" class="${options.class}" selection="${index}" style="position: absolute;top: ${options.top};right:${options.right};bottom:${options.bottom};left: ${options.left};z-index: 5;">`)
                }
            }
        }
    }
    startSelection(Callback = false, Options = {}) {
        Options.top = Options?.top || "10px";
        Options.right = Options?.right || "auto";
        Options.bottom = Options?.bottom || "auto";
        Options.left = Options?.left || "10px";
        Options.class = Options?.class || "selection";

        this.selectionOptions = Options;
        this.inSelection = true;
        if (this.#viewContainer.rows) {
            this.#setupSelection(0, this.#viewContainer.rows.length - 1);
        } else {
            this.#setupSelection(0, this.#viewContainer.children.length - 1);
        }
        // add Event Listener 
        this.#mainContainer.onclick = (e) => {
            e.preventDefault()
            let element;
            if (this.#viewContainer == this.#gridContainer) {
                element = e.target.closest(`#ViewGridContainer > ${this.#gridItemTagName}`);

            } else if (this.#viewContainer == this.#listContainer) {
                element = e.target.closest(`#ViewListContainer > ${this.#listItemTagName}`);
            } else {
                element = e.target.closest("tbody tr");
            }
            if (element) {
                const input = element.querySelector("input[selection]");
                if (e.target == input) { return }
                if (!input) { return; }
                input.checked = !input.checked;
                const index = Number(input.getAttribute("selection"));
                if (input.checked) {
                    this.selected.push({
                        index,
                        data: this.#renderData[index]
                    });
                    input.setAttribute("checked", true);
                }
                else {
                    input.removeAttribute("checked");
                    this.selected.splice(this.selected.findIndex(element => element.index == index), 1);
                }
                if (Callback != false) {
                    Callback({
                        index: index,
                        element: element,
                        checked: input.checked
                    })
                }
            } else {
                const input = this.#viewContainer.querySelector("input[selection=all]");
                if (input) {
                    const inputs = this.#viewContainer.querySelectorAll("input[selection]");
                    const length = inputs.length - 1;
                    if (input.checked) {
                        for (let index = 0; index < length; index++) {
                            const input = inputs[index + 1];
                            this.selected.push({
                                index,
                                data: this.#renderData[index]
                            });
                            input.setAttribute("checked", true);
                            input.checked = true;
                        }
                    } else {
                        for (let index = 0; index < length; index++) {
                            const input = inputs[index + 1];
                            input.removeAttribute("checked");
                            input.checked = false;
                            this.selected.splice(this.selected.findIndex(element => element.index == index), 1);
                        }
                    }
                    if (Callback != false) {
                        Callback({
                            checked: input.checked
                        });
                    }
                }
            }
        }
    }
    stopSelection() {
        this.selected = [];
        this.inSelection = false;
        const inputs = this.#viewContainer.querySelectorAll("input[selection]");
        const length = inputs.length
        if (this.#viewContainer.rows) {
            for (let index = 0; index < length; index++) {
                inputs[index].parentElement.remove();
            }
        } else {
            for (let index = 0; index < length; index++) {
                inputs[index].remove();
            }
        }
        this.#mainContainer.onclick = null
    }
    updateData(Callback) {
        this.#data = Callback(this.#data);
    }
    jumpToPage(PageNumber) {
        if (this.inSelection) { return "You are in Selection Mode"; }
        if (this.#renderState == "main") {
            this.#currentPage = PageNumber;

            this.#firstRenderRow = 0

            for (let index = 1; index < PageNumber; index++) {
                this.#firstRenderRow += this.#perPage;
            }
            this.#lastRenderRow = this.#firstRenderRow;
        } else if (this.#renderState == "search") {
            this.#searchCurrentPage = PageNumber;
            this.#searchFirstRenderRow = 0
            for (let index = 1; index < PageNumber; index++) {
                this.#searchFirstRenderRow += this.#perPage
            }
            this.#searchLastRenderRow = this.#searchFirstRenderRow
        }
        this.#reRenderGrid = true;
        this.#reRenderList = true;
        this.#reRenderTable = true;
        this.#rendering()
    }
    nextPage() {
        if (this.inSelection) { return "You are in Selection Mode"; }
        if (this.#renderState == "main") {
            const currentPage = this.#currentPage;
            if (currentPage < this.#totalPages) {
                this.#firstRenderRow = ++this.#lastRenderRow;
                this.#reRenderGrid = true;
                this.#reRenderList = true;
                this.#reRenderTable = true;
                this.#currentPage += 1;
                this.#animationOn = "nextPage"
                this.#rendering()
            }
        } else if (this.#renderState == "search") {
            if (this.#searchCurrentPage < this.#searchTotalPages) {
                this.#searchFirstRenderRow = ++this.#searchLastRenderRow;
                this.#searchCurrentPage += 1;
                this.#animationOn = "nextPage"
                this.#rendering()
            }
        }

    }
    previousPage() {
        if (this.inSelection) { return "You are in Selection Mode"; }
        if (this.#renderState == "main") {
            const currentPage = this.#currentPage;
            if (currentPage > 1) {
                this.#firstRenderRow -= this.#perPage
                this.#lastRenderRow = this.#firstRenderRow;
                this.#reRenderGrid = true;
                this.#reRenderList = true;
                this.#reRenderTable = true;
                this.#currentPage--;
                this.#animationOn = "previousPage"
                this.#rendering()
            }
        } else if (this.#renderState == "search") {
            if (this.#searchCurrentPage > 1) {
                this.#searchFirstRenderRow -= this.#perPage;
                this.#searchLastRenderRow = this.#searchFirstRenderRow
                this.#searchCurrentPage--;
                this.#animationOn = "previousPage"
                this.#rendering()
            }
        }
    }
    #searchContainerConfig(View = null) {
        if (this.#viewContainer.id == this.#gridContainer.id || View == "grid") {
            this.#searchContainer.style.gap = this.#gridGap;
            this.#gridStyle(this.#searchContainer);
        } else if (this.#viewContainer.id == this.#listContainer.id || View == "list") {
            this.#searchContainer.style.gap = this.#listGap;
            this.#listStyle(this.#searchContainer);
        } else {
            this.#searchContainer.style.gridTemplateColumns = `repeat(1,1fr)`;
        }
    }
    #animator(Callback, Container) {
        switch (this.#animation) {
            case "slide":
                switch (this.#animationOn) {
                    case 'nextPage':
                        Container.classList.remove("slide-left-out");
                        Container.classList.remove("slide-left-in");
                        Container.classList.add("slide-left-out");
                        setTimeout(() => {
                            Callback();
                            Container.classList.add("slide-left-in");
                        }, this.#animationDuration * 1000);
                        setTimeout(() => {
                            Container.classList.remove("slide-left-out");
                            Container.classList.remove("slide-left-in");
                        }, this.#animationDuration * 1000 + this.#animationDuration * 1000);
                        return;
                    case 'previousPage':
                        Container.classList.remove("slide-right-out");
                        Container.classList.remove("slide-right-in");
                        Container.classList.add("slide-right-out");
                        setTimeout(() => {
                            Callback();
                            Container.classList.add("slide-right-in");
                        }, this.#animationDuration * 1000);
                        setTimeout(() => {
                            Container.classList.remove("slide-right-out");
                            Container.classList.remove("slide-right-in");
                        }, this.#animationDuration * 1000 + this.#animationDuration * 1000);
                        return;
                }
                return;
            case "fade":
                Container.classList.remove("fade-in");
                Container.classList.add("fade-out");
                setTimeout(() => {
                    Callback();
                    Container.classList.add("fade-in");
                    Container.classList.remove("fade-out");
                }, this.#animationDuration * 1000);
                setTimeout(() => {
                    Container.classList.remove("fade-in");
                }, this.#animationDuration * 1000 + this.#animationDuration * 1000);
                return;
        }
    }
    #gridStyle(Container = this.#gridContainer) {
        let style = ''
        if (this.#gridItemWidth == "fit") {
            style = `
                #${Container.id} > ${this.#gridItemTagName}{
                    min-width:${this.#gridItemMinWidth};
                }
                `;
            let numberOfRows = Math.floor(this.#mainContainer.offsetWidth / (parseInt(this.#gridItemMinWidth.match(/\d*/)[0]) + parseInt(this.#gridGap.match(/\d*/)[0])))
            Container.style.gridTemplateColumns = `repeat(${numberOfRows},1fr)`
        } else {
            style = `
                #${Container.id}{
                    ${this.#position}
                }
                #${Container.id} > ${this.#gridItemTagName}{
                    min-width:${this.#gridItemMinWidth};
                    width:100%;
                    max-width:${this.#gridItemWidth};
                }
                `;
            let numberOfRows = Math.floor(this.#mainContainer.offsetWidth / parseInt(this.#gridItemWidth.match(/\d*/)[0]))
            Container.style.gridTemplateColumns = `repeat(${numberOfRows},${this.#gridItemWidth})`
        }
        // 
        if (document.getElementById("DataViewStyle") == null) {
            const styleTag = document.createElement("style");
            styleTag.id = 'DataViewStyle';
            styleTag.textContent += style
            this.#mainContainer.append(styleTag);

        } else {
            document.getElementById("DataViewStyle").textContent += style
        }
    }
    #listStyle(Container = this.#listContainer) {
        let style = ''
        if (this.#listItemWidth == "fit") {
            style = `
                #${Container.id} > ${this.#listItemTagName}{
                    min-width:${this.#listItemMinWidth};
                }
                `;
            let numberOfRows = Math.floor(this.#mainContainer.offsetWidth / (parseInt(this.#listItemMinWidth.match(/\d*/)[0]) + parseInt(this.#listGap.match(/\d*/)[0])))
            Container.style.gridTemplateColumns = `repeat(${numberOfRows},1fr)`
        } else {
            style = `
                #${Container.id}{
                    ${this.#position}
                }
                #${Container.id} > ${this.#listItemTagName}{
                    min-width:${this.#listItemMinWidth};
                    width:100%;
                    max-width:${this.#listItemWidth};
                }
                `;
            let numberOfRows = Math.floor(this.#mainContainer.offsetWidth / parseInt(this.#listItemWidth.match(/\d*/)[0]))
            Container.style.gridTemplateColumns = `repeat(${numberOfRows},${this.#listItemWidth})`
        }
        // 
        if (document.getElementById("DataViewStyle") == null) {
            const styleTag = document.createElement("style");
            styleTag.id = 'DataViewStyle';
            styleTag.textContent += style
            this.#mainContainer.append(styleTag);

        } else {
            document.getElementById("DataViewStyle").textContent += style
        }
    }
    #calculateTotalPages() {
        return Math.ceil(this.#renderData.length / this.#perPage);
    }
}

class Templator {
    #templatingBasicMethods;
    #lazyloadImageColor;
    #placeholderRegexForEveryRow;
    #conditionalRegex
    #formatters;
    templator = null
    constructor(Options) {
        this.#templatingBasicMethods = {
            formatNum: this.formatNum
        }
        this.#lazyloadImageColor = Options.lazyloadImageColor
        this.#placeholderRegexForEveryRow = /{%(.[^{%]*?)%}/g;
        this.#conditionalRegex = /\{%if\s+(.*?)\s+%}(.*?){%else%}(.*?){%endif%}/gs;
        this.#formatters = {
            upper: (value) => value.toUpperCase(),
            lower: (value) => value.toLowerCase(),
            firstCap: (value) => value[0].toUpperCase() + value.slice(1).toLowerCase(),
            length: (value, length) => value.slice(0, Number(length) + 1),
            formatNum: (value) => this.formatNum(value),
        };
    }
    register(Templator) {
        this.templator = new Templator(this.#templatingBasicMethods);
    }
    oneTimeParse(Template) {
        const placeholderRegex = /{{(.*?)}}/g;
        let renderedTemplate = Template;
        if (this.templator != null && this.templator.oneTimeParse != undefined) {
            renderedTemplate = this.templator.oneTimeParse(renderedTemplate)
        }
        const date = new Date()
        renderedTemplate = Template.replace(placeholderRegex, (match, placeholders) => {
            const [type, name] = placeholders.split(":")
            const [, ...formatters] = name != undefined ? name.split("|") : ""
            let returnValue = match;
            switch (type) {
                case 'date':
                    switch (name) {
                        case "y":
                            returnValue = date.getFullYear()
                            break;
                        case "m":
                            returnValue = date.getMonth() + 1
                            break;
                        case "d":
                            returnValue = date.getDate()
                            break;
                        default:
                            returnValue = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
                            break;
                    }
                    break;
                case 'time':
                    const time = new Date()
                    switch (name) {
                        case "h":
                            returnValue = time.getHours()
                            break;
                        case "m":
                            returnValue = time.getMinutes()
                            break;
                        case "s":
                            returnValue = time.getSeconds()
                            break;
                        default:
                            returnValue = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
                            break;
                    }
                    break;
            }
            return returnValue
        });
        // Load Image
        const tagPlaceholderRegex = /{{loadimage\|(.*?)>}}/g;
        renderedTemplate = renderedTemplate.replace(tagPlaceholderRegex, (match, placeholders) => {
            let [height, element] = placeholders.split("|");
            let width = '';
            if (!element?.startsWith("<img")) {
                width = `width:${element};`
                element = placeholders.split("|")[2]
            }
            if (element?.match(/style=('|")(.*?)/)) {
                element = `${element.slice(0, element.match(/style="?'?(.*?)/).index + 7)}width:100%;height:100%;visibility:hidden;${element.slice(element.match(/style="?'?(.*?)/).index + 7)}>`
            } else {
                element += ` style="width:100%;height:100%;visibility:hidden;">`
            }
            element = element.replace(/src=('|")(.*?)('|")/, (Match, Extra, Value) => {
                return `data-view-loadimg="${Value}"`
            })
            let parent = `<div style="${width}height:${height};background:${this.#lazyloadImageColor};">${element}</div>`
            return parent;
        });
        return renderedTemplate
    }
    parseOnEveryRow(Template, Data, NumberOfRow) {
        let renderedTemplate = Template;
        if (this.templator != null && this.templator.parseOnEveryRow != undefined) {
            renderedTemplate = this.templator.parseOnEveryRow(renderedTemplate, Data, NumberOfRow)
        }
        // Handle conditional statements
        renderedTemplate = renderedTemplate.replace(this.#conditionalRegex, (match, condition, trueBlock, falseBlock) => {
            // Evaluate the condition based on the data
            const [,column] = condition.split(":")
            if (Data[column] == undefined) { return; }
            const subKey = column.match(/\[([^)]+)\]/)
            const columnValue = subKey ? Data[column.slice(0, subKey?.index)][subKey[1]] : Data[column];
            // Return the appropriate block based on the condition
            return columnValue ? trueBlock : (falseBlock ? falseBlock.trim() : '');
        });
        //   
        renderedTemplate = renderedTemplate.replace(this.#placeholderRegexForEveryRow, (match, placeholders) => {
            const [type, others, formatterDynamic] = placeholders.split(":")
            const [name, formatter] = others != undefined ? others.split("|") : ""
            switch (type) {
                case "counter":
                    return NumberOfRow + 1
                case "column":
                    if (Data[name] == undefined) { return; }
                    const subKey = name.match(/\[([^)]+)\]/)
                    const columnValue = subKey ? Data[name.slice(0, subKey?.index)][subKey[1]] : Data[name];
                    if (this.#formatters[formatter]) {
                        return this.#formatters[formatter](columnValue);
                    } else {
                        return columnValue;
                    }
            }
        });
        
        return renderedTemplate;
    }
    formatNum(Value) {
        let array = Value.toString().split('');
        if (array.length == 5 && array[2] != '.') {
            array.splice(2, 0, ",");
        } else {
            if (array[3] != '.' && array.length > 3) {
                array.splice(3, 0, ",");
            }
        }
        if (array.indexOf(".") != -1 && array.length > array.indexOf(".") + 2) {
            array.length = array.indexOf(".") + 2;
        }
        return array.join('');
    }
}
module.exports = Pagination