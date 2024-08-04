class Pagination{#t=[{}];#e;#i=null;#s;#r;#a;#n;#h;#l;#o;#d=null;#c=null;#m;#g=[];#u=null;#p;#C;#f;#w;#R=null;#y=null;#v;#b=!0;#I="main";#S=0;#P=0;#T=0;#L=0;#W=1;#$=1;#x;#A;#D;#O=!0;#M=!0;#k=!0;#F;#H;#N=null;#E;#G;#j;#U;#V;#z=[];constructor(t,e){this.#s=e,this.#s.style.overflow="hidden",Array.isArray(t)?"[object Object]"!==Object.prototype.toString.call(t[0])?this.#z.push("Invalid Data | Data is Not An Array Object | Data must be Array Object"):(this.#t=t,this.dataLength=this.#t.length):this.#z.push("Invalid Data | Data is Not An Array | Data must be Array Object"),this.POSITIONS={LEFT:"justify-content: flex-start;",RIGHT:"justify-content: flex-end;",CENTER:"justify-content: center;",BETWEEN:"justify-content: space-between;",AROUND:"justify-content: space-around;",EVENLY:"justify-content: space-evenly;"}}config(t={}){this.#e=this.#t,this.#x=t.perPage||20,this.#F=t.lazyloadImageColor||"#eee",this.#h=t.gridGap||"10px",this.#o=t.gridItemMinWidth||"200px",this.#l=t.gridItemWidth||"fit",t.gridItemMinWidth&&t.gridItemMinWidth.endsWith("%")&&this.errors.push("In gridItemMinWidth % percentage is not allowed"),t.gridItemWidth&&t.gridItemWidth.endsWith("%")&&this.errors.push("In gridItemWidth % percentage is not allowed"),this.#C=t.listGap||"10px",this.#w=t.listItemMinWidth||"500px",this.#f=t.listItemWidth||"fit",t.listItemMinWidth&&t.listItemMinWidth.endsWith("%")&&this.errors.push("In listItemMinWidth % percentage is not allowed"),t.listItemWidth&&t.listItemWidth.endsWith("%")&&this.errors.push("In listItemWidth % percentage is not allowed"),this.searchIn=t.searchIn||"all",this.searchCaseSensitive=t.searchCaseSensitive||!1,this.#v=document.createElement("div"),this.#v.id="ViewSearchContainer",this.#s.append(this.#v),this.#H=t.animation||!1,this.#E=t.animationDuration?.slice(0,-1)||".5",this.#G=t.position||this.POSITIONS.LEFT,this.#A=this.#B(),this.columns=Object.keys(this.#t[0]),this.selected=[],this.inSelection=!1,this.#W=1,this.#S=0,this.#P=0,this.#i=new Templator({lazyloadImageColor:this.#F}),this.#V=new IntersectionObserver((t=>{const e=t.length;for(let i=0;i<e;i++)if(t[i].isIntersecting){const e=t[i].target;e.src=e.dataset.viewLoadimg,e.style.visibility="visible",this.#V.unobserve(e)}}),{rootMargin:"120px"}),setTimeout((()=>{this.#v.style.display="grid",this.#v.style.position="relative",this.apiSearching=t.apiSearching||!1,this.searchApi=t.searchApi||"",this.searchApiOptions=t.searchApiOptions||{},this.apiSearching&&(""==this.searchApi?this.#z.push("Search API Url not provided for fetching data."):"string"!=typeof this.searchApi?this.#z.push("Invalid Search API Url"):this.searchApi.startsWith("http")||this.searchApi.startsWith("https")||this.#z.push("Invalid Search API Url .Protocol not Provided")),this.#j=t.autoFetch||!1,this.#U=t.autoFetchWhen||40,this.dataApiUrl=t.dataApiUrl||"",this.dataApiOptions=t.dataApiOptions||{},this.#j&&(""==this.dataApiUrl?this.#z.push("Data API Url not provided for fetching data."):"string"!=typeof this.dataApiUrl?this.#z.push("Invalid Data API Url"):this.dataApiUrl.startsWith("http")||this.dataApiUrl.startsWith("https")||this.#z.push("Invalid Data API Url .Protocol not Provided")),window.addEventListener("resize",(()=>{this.#r==this.#n?this.#q():this.#r==this.#p&&this.#Y()}))}),500)}get totalPages(){let t;return"main"==this.#I?t=this.#A:"search"==this.#I&&(t=this.#D),t}get currentPage(){let t;return"main"==this.#I?t=this.#W:"search"==this.#I&&(t=this.#$),t}get errors(){return this.#z}get register(){const t=this;return{templator(e){t.#i.register(e)}}}set listItemTemplate(t){if(this.#z.length>0)return;if(!(t=t.trim()).startsWith("<"))return this.#z.push("Invalid List Item Template"),"";const e=t.indexOf("<"),i=t.indexOf(" ",e),s=-1!==i?i:t.indexOf(">",e);let r=t.slice(e+1,s).toLowerCase();if(r=-1!=r.lastIndexOf(">")?r.slice(0,-2):r,!t.endsWith(`</${r}>`))return this.#z.push("Invalid List Item Template"),"";this.#y=r,this.#R=this.#i.oneTimeParse(t),this.#p=document.createElement("div"),this.#p.id="ViewListContainer",this.listContainerClass="data-view-list",this.#p.className=this.listContainerClass,this.#p.style.display="none",this.#p.style.gap=this.#C,this.#p.style.position="relative",this.#s.append(this.#p),this.#Y()}set gridItemTemplate(t){if(this.#z.length>0)return;if(!(t=t.trim()).startsWith("<"))return this.#z.push("Invalid Grid Item Template"),"";const e=t.indexOf("<"),i=t.indexOf(" ",e),s=-1!==i?i:t.indexOf(">",e);let r=t.slice(e+1,s).toLowerCase();if(r=-1!=r.lastIndexOf(">")?r.slice(0,-2):r,!t.endsWith(`</${r}>`))return this.#z.push("Invalid Grid Item Template"),"";this.#c=r,this.#d=this.#i.oneTimeParse(t),this.#n=document.createElement("div"),this.#n.id="ViewGridContainer",this.gridContainerClass="data-view-grid",this.#n.className=this.gridContainerClass,this.#n.style.display="none",this.#n.style.gap=this.#h,this.#n.style.position="relative",this.#s.append(this.#n),this.#q()}set tableRowHtml(t){if(!(this.#z.length>0)){if(!(t=t.trim()).startsWith("<"))return this.#z.push("Invalid Table Row Template"),"";this.#u=this.#i.oneTimeParse(t),this.#m=document.createElement("table"),this.#m.id="ViewTableContainer",this.#m.style.position="relative",this.tableClass="data-view-table table",this.#m.className=this.tableClass,this.#m.createTBody(),this.#m.style.display="none",this.#s.append(this.#m)}}set tableColumns(t){if(null==this.#u)return this.#z.push("Please Set Table Row Template First."),null;this.#g=t;let e=this.#m.createTHead(),i="<tr>";for(let t=0;t<this.#g.length;t++)i+=`<th>${this.#g[t]}</th>`;i+="</tr>",e.innerHTML=i}set perPage(t){this.#x=parseInt(t),this.#A=this.#B();const e=this.#S;if(e+this.#x>this.dataLength||e<this.#x)this.#S=0,this.#W=1;else{this.#W=1;for(let t=0;t<this.#S;t+=this.#x)t+this.#x>this.#S?this.#S=t:this.#W++}this.#P=this.#S,this.#O=!0,this.#M=!0,this.#k=!0,this.#Q()}set view(t){if(this.inSelection)return"You are in Selection Mode";if(this.#a=t,"search"==this.#I)return"table"==this.#a?(this.#v.style.display="none",this.#r=this.#m,this.#r.style.display="table"):(this.#m.style.display="none",this.#J(this.#a),this.#r=this.#v,this.#r.style.display="grid"),this.#T=0,this.#L=0,this.#$=1,void this.#Q();switch(t){case"grid":if(null==this.#d)return this.#z.push("Please Set Grid Item Template First."),null;this.#p&&(this.#p.style.display="none"),this.#m&&(this.#m.style.display="none"),this.#n.style.display="grid",this.#r=this.#n,this.#O&&(this.#P=this.#S,this.#Q()),this.#b=!0;break;case"list":if(null==this.#R)return this.#z.push("Please Set List Item Template First."),null;this.#n&&(this.#n.style.display="none"),this.#m&&(this.#m.style.display="none"),this.#p.style.display="grid",this.#r=this.#p,this.#M&&(this.#P=this.#S,this.#Q()),this.#b=!0;break;case"table":if(null==this.#u)return this.#z.push("Please Set Table Row Template First."),null;this.#n&&(this.#n.style.display="none"),this.#p&&(this.#p.style.display="none"),this.#m.style.display="table",this.#r=this.#m,this.#k&&(this.#P=this.#S,this.#Q());break}}async search(t){if(this.inSelection)return"You are in Selection Mode";if(""==t)return"grid"==this.#a?(this.#r=this.#n,this.#n.style.display="grid"):"list"==this.#a?(this.#r=this.#p,this.#p.style.display="grid"):"table"==this.#a&&(this.#r=this.#m,this.#m.style.display="table"),this.#v.style.display="none",this.#e=this.#t,this.#$=1,this.#I="main",(this.#O||this.#M||this.#k)&&(this.#P=this.#S,this.#Q()),this.#v.innerHTML="",void(this.searchQuery=null);if(this.#b&&(this.#b=!1,this.#J()),this.apiSearching){const e=this.searchApi.replace(/{(.*?)}/g,((e,i)=>"query"==i?t:"searchCaseSensitive"==i?this.searchCaseSensitive:"column"==i?this.searchIn:"last"==i||"last:index"==i?this.dataLength-1:"last:counter"==i?this.dataLength:i.startsWith("last:")?this.#t[this.dataLength-1][i.slice(5)]?.toString().replace(/ /g,"%20"):"perPage"==i?this.#x:void 0));let i=await fetch(e,this.searchApiOptions);try{i=await i.json(),this.afterSearching?this.#e=this.afterSearching(i):this.#e=i}catch(t){this.afterSearching&&(this.errors.push(t),this.afterSearching(t))}}else this.#e=this.#t.filter((e=>"all"==this.searchIn?this.searchCaseSensitive?JSON.stringify(e).includes(t):JSON.stringify(e).toLowerCase().includes(t.toLowerCase()):this.searchCaseSensitive?String(e[this.searchIn]).includes(t):String(e[this.searchIn]).toLowerCase().includes(t.toLowerCase())));this.#r!=this.#v&&("grid"==this.#a?this.#n.style.display="none":"list"==this.#a?this.#p.style.display="none":"table"==this.#a&&(this.#m.style.display="none"),"table"==this.#a?(this.#r=this.#m,this.#r.style.display="table"):(this.#r=this.#v,this.#r.style.display="grid")),this.#T=0,this.#L=0,this.#$=1,this.#I="search",this.#Q(),this.searchQuery=t,this.#D=this.#B()}render(t="grid"){switch(this.#a=t,t){case"grid":if(null==this.#d)return this.#z.push("Please Set Grid Item Template First."),null;this.#n.style.display="grid",this.#r=this.#n;break;case"list":if(null==this.#R)return this.#z.push("Please Set List Item Template First."),null;this.#p.style.display="grid",this.#r=this.#p;break;case"table":if(null==this.#u)return this.#z.push("Please Set Table Row Template First."),null;null==this.#m.tHead&&this.#z.push("Please Set Table Headings First With tableColumns Which Is Setter Method."),this.#m.style.display="table",this.#r=this.#m,this.#b=!1;break}this.#Q()}async#K(){let t,e,i;if("main"==this.#I?(t=this.#P,e=this.dataLength,i=this.dataApiUrl):(t=this.#L,e=this.#e.length,i=this.searchApi.replace(/{(.*?)}/g,((t,e)=>"query"==e?this.searchQuery:"searchCaseSensitive"==e?this.searchCaseSensitive:"column"==e?this.searchIn:void 0))),e-(t+1)<=this.#U&&e>=this.#x){this.beforeAutofetch&&this.beforeAutofetch();const t=i.replace(/{(.*?)}/g,((t,e)=>"last"==e||"last:index"==e?this.dataLength-1:"last:counter"==e?this.dataLength:e.startsWith("last:")?this.#t[this.dataLength-1][e.slice(5)]?.toString().replace(/ /g,"%20"):"perPage"==e?this.#x:void 0));let e=await fetch(t,this.dataApiOptions);try{let t;e=await e.json(),t=this.afterAutofetch?this.afterAutofetch(e):e,"main"==this.#I?(this.#t=this.#t.concat(t),this.#e=this.#t):this.#e=this.#e.concat(t),"main"==this.#I?(this.#A=this.#B(),this.dataLength+=t.length):this.#D=this.#B()}catch(t){this.afterAutofetch&&this.afterAutofetch(t),this.errors.push(t)}}}#Q(t=!0){if(this.errors.length>0)return;let e,i,s;if("main"==this.#I?(i=t?this.#S:++this.#P,s=this.#P):"search"==this.#I&&(i=t?this.#T:++this.#L,s=this.#L),"grid"==this.#a){if(null==this.#d)return this.#z.push("Please Set Grid Item Template First."),null;e=this.#d}else if("list"==this.#a){if(null==this.#R)return this.#z.push("Please Set List Item Template First."),null;e=this.#R}else if("table"==this.#a){if(null==this.#u)return this.#z.push("Please Set Table Row Template First."),null;e=this.#u}let r,a=this.#x+s;const n=document.createDocumentFragment(),h=document.createElement("tbody");for(r=i;r<a&&null!=this.#e[r];r++)h.insertAdjacentHTML("beforeend",this.#i.parseOnEveryRow(e,this.#e[r],r)),n.appendChild(h.firstChild);"search"==this.#I?this.#L=--r:this.#P=--r;const l=()=>{let e=this.#r;"table"==this.#a&&(e=e.tBodies[0]),t?(e.innerHTML="",e.appendChild(n)):e.appendChild(n),setTimeout((()=>{"main"==this.#I?"grid"==this.#a?this.#O=!1:"list"==this.#a?this.#M=!1:"table"==this.#a&&(this.#k=!1):"table"==this.#a&&(this.#k=!0);const t=document.querySelectorAll(`#${this.#r.id} img[data-view-loadimg]`),e=t.length;for(let i=0;i<e;i++)this.#V.observe(t[i])}),70)};0!=this.#H&&null!=this.#N?this.#X((()=>{l()}),this.#r):l(),this.#j&&setTimeout((()=>{this.#K()}),110),this.inSelection&&setTimeout((()=>{this.#Z(i,this.#P)}),80)}#Z(t,e){const i=this.selectionOptions;if(this.#r==this.#m){const s=this.#r.rows;if(0==t)s[0].insertCell(0).innerHTML=`<input type="checkbox" class="${i.class}" selection="all">`;for(let r=t;r<=e&&null!=s[r+1];r++){s[r+1].insertCell(0).innerHTML=`<input type="checkbox" class="${i.class}" selection="${r}">`}}else{const s=this.#r.children;if(null==s[t]){const t=this.#r.querySelectorAll("input[selection]"),e=t.length,r=t.length+this.#x;for(let t=e;t<=r&&null!=s[t];t++)s[t].insertAdjacentHTML("afterbegin",`<input type="checkbox" class="${i.class}" selection="${t}" style="position: absolute;top: ${i.top};right:${i.right};bottom:${i.bottom};left: ${i.left};z-index: 5;">`)}else for(let r=t;r<=e&&null!=s[r];r++)s[r].insertAdjacentHTML("afterbegin",`<input type="checkbox" class="${i.class}" selection="${r}" style="position: absolute;top: ${i.top};right:${i.right};bottom:${i.bottom};left: ${i.left};z-index: 5;">`)}}startSelection(t=!1,e={}){e.top=e?.top||"10px",e.right=e?.right||"auto",e.bottom=e?.bottom||"auto",e.left=e?.left||"10px",e.class=e?.class||"selection",this.selectionOptions=e,this.inSelection=!0,this.#r.rows?this.#Z(0,this.#r.rows.length-1):this.#Z(0,this.#r.children.length-1),this.#s.onclick=e=>{let i;if(e.preventDefault(),i=this.#r==this.#n?e.target.closest(`#ViewGridContainer > ${this.#c}`):this.#r==this.#p?e.target.closest(`#ViewListContainer > ${this.#y}`):e.target.closest("tbody tr"),i){const s=i.querySelector("input[selection]");if(e.target==s)return;if(!s)return;s.checked=!s.checked;const r=Number(s.getAttribute("selection"));s.checked?(this.selected.push({index:r,data:this.#e[r]}),s.setAttribute("checked",!0)):(s.removeAttribute("checked"),this.selected.splice(this.selected.findIndex((t=>t.index==r)),1)),0!=t&&t({index:r,element:i,checked:s.checked})}else{const e=this.#r.querySelector("input[selection=all]");if(e){const i=this.#r.querySelectorAll("input[selection]"),s=i.length-1;if(e.checked)for(let t=0;t<s;t++){const e=i[t+1];this.selected.push({index:t,data:this.#e[t]}),e.setAttribute("checked",!0),e.checked=!0}else for(let t=0;t<s;t++){const e=i[t+1];e.removeAttribute("checked"),e.checked=!1,this.selected.splice(this.selected.findIndex((e=>e.index==t)),1)}0!=t&&t({checked:e.checked})}}}}stopSelection(){this.selected=[],this.inSelection=!1;const t=this.#r.querySelectorAll("input[selection]"),e=t.length;if(this.#r.rows)for(let i=0;i<e;i++)t[i].parentElement.remove();else for(let i=0;i<e;i++)t[i].remove();this.#s.onclick=null}updateData(t){this.#t=t(this.#t)}jumpToPage(t){if(this.inSelection)return"You are in Selection Mode";if("main"==this.#I){this.#W=t,this.#S=0;for(let e=1;e<t;e++)this.#S+=this.#x;this.#P=this.#S}else if("search"==this.#I){this.#$=t,this.#T=0;for(let e=1;e<t;e++)this.#T+=this.#x;this.#L=this.#T}this.#O=!0,this.#M=!0,this.#k=!0,this.#Q()}nextPage(){if(this.inSelection)return"You are in Selection Mode";if("main"==this.#I){this.#W<this.#A&&(this.#S=++this.#P,this.#O=!0,this.#M=!0,this.#k=!0,this.#W+=1,this.#N="nextPage",this.#Q())}else"search"==this.#I&&this.#$<this.#D&&(this.#T=++this.#L,this.#$+=1,this.#N="nextPage",this.#Q())}previousPage(){if(this.inSelection)return"You are in Selection Mode";if("main"==this.#I){this.#W>1&&(this.#S-=this.#x,this.#P=this.#S,this.#O=!0,this.#M=!0,this.#k=!0,this.#W--,this.#N="previousPage",this.#Q())}else"search"==this.#I&&this.#$>1&&(this.#T-=this.#x,this.#L=this.#T,this.#$--,this.#N="previousPage",this.#Q())}#J(t=null){this.#r.id==this.#n.id||"grid"==t?(this.#v.style.gap=this.#h,this.#q(this.#v)):this.#r.id==this.#p.id||"list"==t?(this.#v.style.gap=this.#C,this.#Y(this.#v)):this.#v.style.gridTemplateColumns="repeat(1,1fr)"}#X(t,e){switch(this.#H){case"slide":switch(this.#N){case"nextPage":return e.classList.remove("slide-left-out"),e.classList.remove("slide-left-in"),e.classList.add("slide-left-out"),setTimeout((()=>{t(),e.classList.add("slide-left-in")}),1e3*this.#E),void setTimeout((()=>{e.classList.remove("slide-left-out"),e.classList.remove("slide-left-in")}),1e3*this.#E+1e3*this.#E);case"previousPage":return e.classList.remove("slide-right-out"),e.classList.remove("slide-right-in"),e.classList.add("slide-right-out"),setTimeout((()=>{t(),e.classList.add("slide-right-in")}),1e3*this.#E),void setTimeout((()=>{e.classList.remove("slide-right-out"),e.classList.remove("slide-right-in")}),1e3*this.#E+1e3*this.#E)}return;case"fade":return e.classList.remove("fade-in"),e.classList.add("fade-out"),setTimeout((()=>{t(),e.classList.add("fade-in"),e.classList.remove("fade-out")}),1e3*this.#E),void setTimeout((()=>{e.classList.remove("fade-in")}),1e3*this.#E+1e3*this.#E)}}#q(t=this.#n){let e="";if("fit"==this.#l){e=`\n                #${t.id} > ${this.#c}{\n                    min-width:${this.#o};\n                }\n                `;let i=Math.floor(this.#s.offsetWidth/(parseInt(this.#o.match(/\d*/)[0])+parseInt(this.#h.match(/\d*/)[0])));t.style.gridTemplateColumns=`repeat(${i},1fr)`}else{e=`\n                #${t.id}{\n                    ${this.#G}\n                }\n                #${t.id} > ${this.#c}{\n                    min-width:${this.#o};\n                    width:100%;\n                    max-width:${this.#l};\n                }\n                `;let i=Math.floor(this.#s.offsetWidth/parseInt(this.#l.match(/\d*/)[0]));t.style.gridTemplateColumns=`repeat(${i},${this.#l})`}if(null==document.getElementById("DataViewStyle")){const t=document.createElement("style");t.id="DataViewStyle",t.textContent+=e,this.#s.append(t)}else document.getElementById("DataViewStyle").textContent+=e}#Y(t=this.#p){let e="";if("fit"==this.#f){e=`\n                #${t.id} > ${this.#y}{\n                    min-width:${this.#w};\n                }\n                `;let i=Math.floor(this.#s.offsetWidth/(parseInt(this.#w.match(/\d*/)[0])+parseInt(this.#C.match(/\d*/)[0])));t.style.gridTemplateColumns=`repeat(${i},1fr)`}else{e=`\n                #${t.id}{\n                    ${this.#G}\n                }\n                #${t.id} > ${this.#y}{\n                    min-width:${this.#w};\n                    width:100%;\n                    max-width:${this.#f};\n                }\n                `;let i=Math.floor(this.#s.offsetWidth/parseInt(this.#f.match(/\d*/)[0]));t.style.gridTemplateColumns=`repeat(${i},${this.#f})`}if(null==document.getElementById("DataViewStyle")){const t=document.createElement("style");t.id="DataViewStyle",t.textContent+=e,this.#s.append(t)}else document.getElementById("DataViewStyle").textContent+=e}#B(){return Math.ceil(this.#e.length/this.#x)}}class Templator{#_;#F;#tt;#et;#it;templator=null;constructor(t){this.#_={formatNum:this.formatNum},this.#F=t.lazyloadImageColor,this.#tt=/{%(.[^{%]*?)%}/g,this.#et=/\{%if\s+(.*?)\s+%}(.*?){%else%}(.*?){%endif%}/gs,this.#it={upper:t=>t.toUpperCase(),lower:t=>t.toLowerCase(),firstCap:t=>t[0].toUpperCase()+t.slice(1).toLowerCase(),length:(t,e)=>t.slice(0,Number(e)+1),formatNum:t=>this.formatNum(t)}}register(t){this.templator=new t(this.#_)}oneTimeParse(t){let e=t;null!=this.templator&&null!=this.templator.oneTimeParse&&(e=this.templator.oneTimeParse(e));const i=new Date;e=t.replace(/{{(.*?)}}/g,((t,e)=>{const[s,r]=e.split(":"),[,...a]=null!=r?r.split("|"):"";let n=t;switch(s){case"date":switch(r){case"y":n=i.getFullYear();break;case"m":n=i.getMonth()+1;break;case"d":n=i.getDate();break;default:n=`${i.getDate()}-${i.getMonth()+1}-${i.getFullYear()}`;break}break;case"time":const t=new Date;switch(r){case"h":n=t.getHours();break;case"m":n=t.getMinutes();break;case"s":n=t.getSeconds();break;default:n=`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;break}break}return n}));return e=e.replace(/{{loadimage\|(.*?)>}}/g,((t,e)=>{let[i,s]=e.split("|"),r="";return s?.startsWith("<img")||(r=`width:${s};`,s=e.split("|")[2]),s?.match(/style=('|")(.*?)/)?s=`${s.slice(0,s.match(/style="?'?(.*?)/).index+7)}width:100%;height:100%;visibility:hidden;${s.slice(s.match(/style="?'?(.*?)/).index+7)}>`:s+=' style="width:100%;height:100%;visibility:hidden;">',s=s.replace(/src=('|")(.*?)('|")/,((t,e,i)=>`data-view-loadimg="${i}"`)),`<div style="${r}height:${i};background:${this.#F};">${s}</div>`})),e}parseOnEveryRow(t,e,i){let s=t;return null!=this.templator&&null!=this.templator.parseOnEveryRow&&(s=this.templator.parseOnEveryRow(s,e,i)),s=s.replace(this.#et,((t,i,s,r)=>{const[,a]=i.split(":");if(null==e[a])return;const n=a.match(/\[([^)]+)\]/);return(n?e[a.slice(0,n?.index)][n[1]]:e[a])?s:r?r.trim():""})),s=s.replace(this.#tt,((t,s)=>{const[r,a,n]=s.split(":"),[h,l]=null!=a?a.split("|"):"";switch(r){case"counter":return i+1;case"column":if(null==e[h])return;const t=h.match(/\[([^)]+)\]/),s=t?e[h.slice(0,t?.index)][t[1]]:e[h];return this.#it[l]?this.#it[l](s):s}})),s}formatNum(t){let e=t.toString().split("");return 5==e.length&&"."!=e[2]?e.splice(2,0,","):"."!=e[3]&&e.length>3&&e.splice(3,0,","),-1!=e.indexOf(".")&&e.length>e.indexOf(".")+2&&(e.length=e.indexOf(".")+2),e.join("")}}module.exports=Pagination;