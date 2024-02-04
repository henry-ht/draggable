"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = {
    el: function (element) {
        if (typeof element === 'string') {
            return document.querySelector(element);
        }
        return element;
    },
    elements: function (element) {
        if (typeof element === 'string') {
            return document.querySelectorAll(element);
        }
        return element;
    },
    options: function (options, defaults) {
        options = options || {};
        for (var option in defaults) {
            options[option] = typeof options[option] !== 'undefined' ? options[option] : defaults[option];
        }
        return options;
    }
};
var defaults = {
    element: HTMLElement,
    parent: HTMLElement,
};
var Draggable = /** @class */ (function () {
    /**
     *
     * @param {ItemsInterface[]} tree
     * @param {object} [options]
     * @param {(HTMLElement|string)} [options.element]
     * @param {(HTMLElement|string)} [options.parent]
     */
    function Draggable(tree) {
        this.success = function (data) { };
        this.actions = function (data) { };
        this._boxes = [];
        this._items = [];
        this._parent = utils.el('#container-draggable');
        this._tree = tree;
        this._init();
    }
    Draggable.prototype._init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._parent instanceof HTMLElement)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._treview(this._tree, this._parent)];
                    case 1:
                        _a.sent();
                        this._box = utils.el('#container-draggable > ul');
                        this._items = utils.elements('#container-draggable li button.btn-draggable-move');
                        this._itemsListener(this._items);
                        this._boxesListener(this._box);
                        _a.label = 2;
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    Draggable.prototype._clickOption = function (data, type, e) {
        this.actions({
            event: e,
            item: data,
            type: type
        });
    };
    Draggable.prototype.clean = function () {
        this._parent.innerHTML = "";
    };
    Draggable.prototype.delete = function (id) {
        var elementDelete = utils.el('#draggable-' + id);
        if (elementDelete instanceof Element) {
            for (var key in this._tree) {
                if (Object.prototype.hasOwnProperty.call(this._tree, key)) {
                    var element = this._tree[key];
                    if (element.id == id) {
                        this._tree.splice(parseInt(key), 1);
                        break;
                    }
                    for (var keyChild in element.children) {
                        if (Object.prototype.hasOwnProperty.call(element.children, keyChild)) {
                            var elementChild = element.children[keyChild];
                            if (elementChild.id == id) {
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
    };
    Draggable.prototype.getOrder = function () {
        return this._tree;
    };
    Draggable.prototype.reOrder = function (parent, before, elementId) {
        var _this = this;
        var _a;
        var liChildren = (_a = utils.el('#container-draggable > ul')) === null || _a === void 0 ? void 0 : _a.children;
        if (liChildren instanceof HTMLCollection) {
            var newOrder = Array.prototype.slice.call(liChildren).map(function (child) {
                var _a, _b;
                var id = (_a = child.getAttribute("id")) === null || _a === void 0 ? void 0 : _a.split('-')[1];
                var item = _this._tree.filter(function (obj) { return obj.id == id; })[0];
                var children = (_b = child.querySelector("#collapse-" + id + " > ul")) === null || _b === void 0 ? void 0 : _b.children;
                if (children instanceof HTMLCollection) {
                    var newChildren = Array.prototype.slice.call(children).map(function (childD) {
                        var _a, _b;
                        var childId = (_a = childD.getAttribute("id")) === null || _a === void 0 ? void 0 : _a.split('-')[1];
                        var childItem = (_b = item.children.filter(function (obj) { return obj.id == childId; })[0]) !== null && _b !== void 0 ? _b : _this._tree.filter(function (obj) { return obj.id == childId; })[0];
                        return childItem;
                    });
                    item.children = newChildren;
                }
                return item;
            });
            this._tree = newOrder;
            this.success({
                order: newOrder
            });
        }
    };
    Draggable.prototype._itemsListener = function (items) {
        var _this = this;
        items.forEach(function (item) {
            item.addEventListener('mousedown', _this._onMousedown.bind(_this), false);
            item.addEventListener('mouseup', _this._onMouseup.bind(_this), false);
            //item.addEventListener('touchstart', fnMousedown);
            //item.addEventListener('touchend', fnMouseup);
        });
    };
    Draggable.prototype._boxesListener = function (box) {
        // boxes.forEach(box => {
        box.addEventListener('dragenter', this._onDragEnter.bind(this), false);
        box.addEventListener('dragover', this._onDragOver.bind(this), false);
        box.addEventListener('dragleave', this._onDragLeave.bind(this), false);
        box.addEventListener('drop', this._onDrop.bind(this), false);
        // });    
    };
    Draggable.prototype._onMousedown = function (e) {
        var parent = e.target.parentElement.closest("li.im-draggable");
        parent.setAttribute("draggable", "true");
        parent.addEventListener('dragstart', this._onDragStart.bind(this), false);
    };
    Draggable.prototype._onMouseup = function (e) {
        var parent = e.target.parentElement.closest("li.im-draggable");
        parent.removeAttribute("draggable", "true");
        parent.removeEventListener('dragstart', this._onDragStart.bind(this), false);
    };
    Draggable.prototype._onDragStart = function (e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    };
    Draggable.prototype._onDragEnter = function (e) {
        e.preventDefault();
        if (e.target instanceof HTMLLIElement) {
            e.target.classList.add('im-draggable-selected');
        }
    };
    Draggable.prototype._onDragOver = function (e) {
        e.preventDefault();
        if (e.target instanceof HTMLLIElement) {
            e.target.classList.add('im-draggable-selected');
        }
    };
    Draggable.prototype._onDragLeave = function (e) {
        if (e.target instanceof HTMLLIElement) {
            e.target.classList.remove('im-draggable-selected');
        }
    };
    Draggable.prototype._onDrop = function (e) {
        var _this = this;
        var _a;
        if (e.target instanceof HTMLLIElement) {
            e.target.classList.remove('im-draggable-selected');
            var id_1 = e.dataTransfer.getData('text/plain');
            var draggable = document.getElementById(id_1);
            var parent_1 = e.target.parentNode;
            parent_1.insertBefore(draggable, (_a = e.target.nextSibling) !== null && _a !== void 0 ? _a : e.target);
            setTimeout(function () {
                var _a;
                _this.reOrder(parent_1, (_a = e.target.nextSibling) !== null && _a !== void 0 ? _a : e.target, id_1);
            }, 50);
        }
    };
    Draggable.prototype._createElement = function (tagName, attrs) {
        var element = document.createElement(tagName);
        for (var key in attrs) {
            element.setAttribute(key, attrs[key].toString());
        }
        return element;
    };
    Draggable.prototype._preloading = function () {
        return this._createElement("span", {
            "class": "spinner-border spinner-border-sm text-light me-1 d-none text-dark",
            "role": "status",
            "aria-hidden": "true"
        });
    };
    Draggable.prototype._treview = function (items, containerDraggable, child, parentId) {
        if (child === void 0) { child = false; }
        if (parentId === void 0) { parentId = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var ulData, ulParent;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ulData = {
                            "class": (child ? "list-group list-group-flush small" : "list-group")
                        };
                        if (parentId) {
                            ulData["data-parent-id"] = parentId;
                        }
                        ulParent = this._createElement("ul", ulData);
                        return [4 /*yield*/, items.forEach(function (item) {
                                var li = _this._createElement("li", {
                                    "class": "list-group-item im-draggable",
                                    "id": "draggable-" + item.id
                                });
                                // li.addEventListener('dragstart', this._onDragStart);
                                var btnGroup = _this._createElement("div", {
                                    "class": "btn-group w-100",
                                });
                                var btnDraggable = _this._createElement("button", {
                                    "class": "btn btn-light btn-sm btn-draggable-move",
                                });
                                var btnDraggableIcon = _this._createElement("i", {
                                    "class": "fa-solid fa-up-down",
                                });
                                btnDraggable.append(btnDraggableIcon);
                                var btnCollapse = _this._createElement("button", {
                                    "class": "btn " + (item.children.length ? "btn-draggable-toggle" : "btn-draggable") + " w-100 text-start",
                                    "data-bs-toggle": "collapse",
                                    "data-bs-target": "#collapse-" + item.id,
                                    "aria-expanded": "false"
                                });
                                btnCollapse.textContent = item.name;
                                var btnTrash = _this._createElement("button", {
                                    "class": "btn btn-light btn-sm",
                                });
                                var btnTrashIcon = _this._createElement("i", {
                                    "class": "fa-regular fa-trash-can",
                                });
                                btnTrash.append(btnTrashIcon);
                                btnTrash.append(_this._preloading());
                                btnTrash.addEventListener('click', _this._clickOption.bind(_this, item, "trash"), false);
                                var btnEdit = _this._createElement("button", {
                                    "class": "btn btn-light btn-sm",
                                });
                                var btnEditIcon = _this._createElement("i", {
                                    "class": "fa-regular fa-pen-to-square",
                                });
                                btnEdit.append(btnEditIcon);
                                btnEdit.append(_this._preloading());
                                btnEdit.addEventListener('click', _this._clickOption.bind(_this, item, "edit"), false);
                                btnGroup.append(btnDraggable);
                                btnGroup.append(btnCollapse);
                                btnGroup.append(btnTrash);
                                btnGroup.append(btnEdit);
                                var borderSelect = _this._createElement("div", {
                                    "class": "ms-auto w-75 border-bottom border-info border-2 border-draggable",
                                });
                                li.append(btnGroup);
                                if (item.children.length) {
                                    var collapseContent = _this._createElement("div", {
                                        "class": "collapse ps-4 mt-1",
                                        "id": "collapse-" + item.id
                                    });
                                    _this._treview(item.children, collapseContent, true, item.id);
                                    li.append(collapseContent);
                                }
                                li.append(borderSelect);
                                ulParent.append(li);
                            })];
                    case 1:
                        _a.sent();
                        containerDraggable.append(ulParent);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return Draggable;
}());
exports.default = Draggable;
