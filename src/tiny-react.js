let root, hooks=[], cursor=0;
function flat(items){return items.flat(Infinity).filter(x=>x!==null&&x!==undefined&&x!==false&&x!==true)}
function createElement(type, props, ...children){return {type,props:props||{},children:flat(children)}}
function render(v){if(typeof v==='string'||typeof v==='number')return document.createTextNode(v);if(typeof v.type==='function')return render(v.type({...v.props,children:v.children}));const el=document.createElement(v.type);for(const [key,value] of Object.entries(v.props)){if(key==='className')el.className=value;else if(key==='style'&&value)Object.assign(el.style,value);else if(key.startsWith('on')&&typeof value==='function')el.addEventListener(key.slice(2).toLowerCase(),value);else if(key==='value')el.value=value;else if(key==='checked')el.checked=value;else if(key==='htmlFor')el.htmlFor=value;else if(key!=='key'&&value!==false&&value!=null)el.setAttribute(key,value===true?'':value)}for(const c of v.children)el.appendChild(render(c));return el}
function rerender(){cursor=0;root.node.replaceChildren(render(root.component()))}
export function useState(value){const i=cursor++;if(!(i in hooks))hooks[i]=typeof value==='function'?value():value;return [hooks[i],next=>{hooks[i]=typeof next==='function'?next(hooks[i]):next;rerender()}]}
export function useMemo(fn){cursor++;return fn()}
export function createRoot(node){return{render(component){root={node,component:()=>component};rerender()}}}
export default {createElement};
