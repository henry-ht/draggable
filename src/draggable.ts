let utils = {
    el: (element:(string|HTMLElement)) => {
        if (typeof element === 'string') {
            return document.querySelector(element);
        }
        return element;
    },
    elements: (element:(string|HTMLElement)) => {
        if (typeof element === 'string') {
            return document.querySelectorAll(element);
        }
        return element;
    },
    options: (options:object, defaults:object) => {
        options = options || {}
        for (let option in defaults) {
            options[option] = typeof options[option] !== 'undefined' ? options[option] : defaults[option]
        }
        return options
    }
};

const defaults = {
    element: HTMLElement,
    parent: HTMLElement,
}

interface ItemInterface {
    id:number;
    name:string;
    children:ItemInterface[];
}

export default class Draggable  {
    success: (data: object) => void = (data: object) => {};
    actions: (data: object) => void = (data: object) => {};
    private _parent: Element | null;
    private _tree: ItemInterface[];
    private _boxes: HTMLElement[] | NodeListOf<Element> = [];
    private _box: HTMLElement;
    private _items: HTMLElement[] | NodeListOf<Element> = [];
    /**
     * 
     * @param {ItemsInterface[]} tree 
     * @param {object} [options] 
     * @param {(HTMLElement|string)} [options.element] 
     * @param {(HTMLElement|string)} [options.parent] 
     */
    constructor(tree:ItemInterface[]){
        this._parent = utils.el('#container-draggable');
        this._tree = tree;
        this._init();
    }
    
    async _init() {
        if(this._parent instanceof HTMLElement){
            await this._treview(this._tree, this._parent);
            this._box = utils.el('#container-draggable > ul')  as unknown as HTMLElement;
            this._items = utils.elements('#container-draggable li button.btn-draggable-move') as unknown as HTMLElement[];
            
            this._itemsListener(this._items);
            this._boxesListener(this._box);
        }
        return true;
    }

    _clickOption(data:object, type:string, e){
        this.actions({
            event: e,
            item: data,
            type: type
        });
    }
    
    clean(){
        this._parent!.innerHTML = "";
    }

    delete(id:number):boolean{
        const elementDelete = utils.el('#draggable-'+id);
        if(elementDelete instanceof Element){
            for (const key in this._tree) {
                if (Object.prototype.hasOwnProperty.call(this._tree, key)) {
                    const element = this._tree[key];
                    if(element.id == id){
                        this._tree.splice(parseInt(key), 1);
                        break;
                    }
                    for (const keyChild in element.children) {
                        if (Object.prototype.hasOwnProperty.call(element.children, keyChild)) {
                            const elementChild = element.children[keyChild];
                            if(elementChild.id == id){
                                element.children.splice(parseInt(keyChild), 1);
                                this._tree[key].children = element.children;
                                break;
                            }
                        }
                    }
                }
            }
            elementDelete.remove();
            return true;
        }
        return false;
    }

    getOrder():object{
        return this._tree;
    }

    reOrder(parent:HTMLElement, before:HTMLElement, elementId:string):void{
        const liChildren:HTMLCollection | undefined = utils.el('#container-draggable > ul')?.children;
        if(liChildren instanceof HTMLCollection){
            const newOrder = Array.prototype.slice.call(liChildren).map((child)=>{
                const id = child.getAttribute("id")?.split('-')[1];
                const item = this._tree.filter((obj) => obj.id == id)[0];
                
                const children = child.querySelector("#collapse-"+id+" > ul")?.children;
                if(children instanceof HTMLCollection){
                    const newChildren = Array.prototype.slice.call(children).map((childD) => {
                        const childId = childD.getAttribute("id")?.split('-')[1];
                        const childItem = item.children.filter((obj) => obj.id == childId)[0] ?? this._tree.filter((obj) => obj.id == childId)[0];

                        return childItem as unknown as ItemInterface;
                    });
                    item.children = newChildren;
                }
                return item as unknown as ItemInterface;
            });
            this._tree = newOrder;
            this.success({
                order: newOrder
            });
        }
    }

    _itemsListener(items:HTMLElement[]) {
        items.forEach((item:HTMLElement) => {
            item.addEventListener('mousedown', this._onMousedown.bind(this), false);
            item.addEventListener('mouseup', this._onMouseup.bind(this), false);
            //item.addEventListener('touchstart', fnMousedown);
            //item.addEventListener('touchend', fnMouseup);
        });
    }

    _boxesListener(box:HTMLElement) {
        // boxes.forEach(box => {
            box.addEventListener('dragenter', this._onDragEnter.bind(this), false)
            box.addEventListener('dragover', this._onDragOver.bind(this), false);
            box.addEventListener('dragleave', this._onDragLeave.bind(this), false);
            box.addEventListener('drop', this._onDrop.bind(this), false);
        // });    
    }

    _onMousedown(e) {
        let parent = e.target.parentElement.closest("li.im-draggable");
        parent.setAttribute("draggable", "true");
        parent.addEventListener('dragstart', this._onDragStart.bind(this), false);
    }

    _onMouseup(e) {
        let parent = e.target.parentElement.closest("li.im-draggable");
        parent.removeAttribute("draggable", "true");
        parent.removeEventListener('dragstart', this._onDragStart.bind(this), false);
    }
    
    _onDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    _onDragEnter(e) {
        e.preventDefault();
        if(e.target instanceof HTMLLIElement){
            e.target.classList.add('im-draggable-selected');
        }
    }

    _onDragOver(e) {
        e.preventDefault();
        if(e.target instanceof HTMLLIElement){
            e.target.classList.add('im-draggable-selected');
        }
    }

    _onDragLeave(e) {
        if(e.target instanceof HTMLLIElement){
            e.target.classList.remove('im-draggable-selected');
        }
    }

    _onDrop(e) {
        if(e.target instanceof HTMLLIElement){
            e.target.classList.remove('im-draggable-selected');
            const id = e.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            const parent = e.target.parentNode;
            parent.insertBefore(draggable, e.target.nextSibling ?? e.target);
            setTimeout(() => {
                this.reOrder(parent, e.target.nextSibling ?? e.target, id);
            }, 50);
        }
    }

    _createElement (tagName:string, attrs:{[key:string]: (string|number)}) {
        const element: HTMLElement | null = document.createElement(tagName);
        for (let key in attrs) {
            element.setAttribute(key, attrs[key].toString());
        }
        return element;
    }

    _preloading(): HTMLElement{
        return this._createElement("span", {
            "class": "spinner-border spinner-border-sm text-light me-1 d-none text-dark",
            "role": "status",
            "aria-hidden": "true"
        });
    }

    async _treview (items:ItemInterface[], containerDraggable:HTMLElement, child:boolean = false, parentId:number = 0) {
        let ulData:{[key:string]: (string|number)} = {
            "class": (child ? "list-group list-group-flush small" : "list-group")
        }
        if(parentId){
            ulData["data-parent-id"] = parentId ;
        }
        const ulParent: HTMLElement | null = this._createElement("ul", ulData);
        await items.forEach((item:ItemInterface) => {
            
            const li: HTMLElement = this._createElement("li", {
                "class": "list-group-item im-draggable",
                "id": "draggable-"+item.id
            });
            // li.addEventListener('dragstart', this._onDragStart);
            const btnGroup: HTMLElement = this._createElement("div", {
                "class": "btn-group w-100",
            });

            const btnDraggable: HTMLElement = this._createElement("button", {
                "class": "btn btn-light btn-sm btn-draggable-move",
            });
            const btnDraggableIcon: HTMLElement = this._createElement("i", {
                "class": "fa-solid fa-up-down",
            });
            btnDraggable.append(btnDraggableIcon);

            const btnCollapse: HTMLElement = this._createElement("button", {
                "class": "btn "+( item.children.length ? "btn-draggable-toggle" : "btn-draggable")+" w-100 text-start",
                "data-bs-toggle": "collapse", 
                "data-bs-target": "#collapse-"+item.id, 
                "aria-expanded": "false"
            });
            btnCollapse.textContent = item.name;

            const btnTrash: HTMLElement = this._createElement("button", {
                "class": "btn btn-light btn-sm",
            });
            const btnTrashIcon: HTMLElement = this._createElement("i", {
                "class": "fa-regular fa-trash-can",
            });
            btnTrash.append(btnTrashIcon);
            btnTrash.append(this._preloading());
            btnTrash.addEventListener('click', this._clickOption.bind(this, item, "trash"), false);

            const btnEdit: HTMLElement = this._createElement("button", {
                "class": "btn btn-light btn-sm",
            });
            const btnEditIcon: HTMLElement = this._createElement("i", {
                "class": "fa-regular fa-pen-to-square",
            });
            btnEdit.append(btnEditIcon);
            btnEdit.append(this._preloading());
            btnEdit.addEventListener('click', this._clickOption.bind(this, item, "edit"), false);

            btnGroup.append(btnDraggable);
            btnGroup.append(btnCollapse);
            btnGroup.append(btnTrash);
            btnGroup.append(btnEdit);

            const borderSelect: HTMLElement = this._createElement("div", {
                "class": "ms-auto w-75 border-bottom border-info border-2 border-draggable",
            });
            
            li.append(btnGroup);
            if(item.children.length){
                const collapseContent: HTMLElement = this._createElement("div", {
                    "class": "collapse ps-4 mt-1",
                    "id": "collapse-"+item.id
                });
                this._treview(item.children, collapseContent, true, item.id);
                li.append(collapseContent);
            }
            li.append(borderSelect);
            ulParent.append(li);
        });
        containerDraggable.append(ulParent);
        return true;
    }
}