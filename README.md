# Draggable for bootstrap

Small library for Bootstrap 5 that allows you to organize and rearrange your data

## Install

```
npm i @henryht/draggable
```

## Usage

1.  Import the pakage.
    ```
    import Draggable from '@henryht/draggable';
    window.Draggable = Draggable;
    ```

2.  Add the container.
    ```
    <div id="container-draggable" ></div>
    ```

3.  Data, The most important data includes: the ID, the name, and the children.
    ```
    const tree = [
        { 
            id: 1,
            name: 'apples',
            description: "lorem lorem",
            children: [] 
        },
        { 
            id: 2,
            name: 'vegetables', 
            children: [] 
        },
        { 
            id: 3,
            name: 'pomelo', 
            children: [
                { 
                    id: 7,
                    name: 'apples 2', 
                    description: "lorem lorem",
                    children: [] 
                },
                { 
                    id: 8,
                    name: 'apples 3', 
                    children: [] 
                },
            ] 
        },
        { 
            id: 4,
            name: 'oranges', 
            children: [] 
        },
        { 
            id: 5,
            name: 'fruits', 
            children: [
                { 
                    id: 9,
                    name: 'fornic', 
                    children: [] 
                },
                { 
                    id: 10,
                    name: 'goku', 
                    children: [] 
                },
            ] 
        },
        { 
            id: 6,
            name: 'brocolli', 
            description: "lorem lorem",
            children: [] 
        },
    ];
    ```
4.  Instantiate the class, and the reorderable tree will be created automatically.
    ```
    const drag = new Draggable(tree);
    ```
5.  This method is always called once the reordering is complete; it returns a list with the ordered data.
    ```
    drag.success = function (data) {}
    ```
6.  Each element has its own options, and this method takes these options, which include: edit and delete.
    ```
    drag.actions = function (data) {}
    ```
7.  This method takes a numeric ID as a parameter.
    ```
    drag.delete(8);
8.  It returns a list of the current state of the tree.
    ```
    drag.getOrder()
    ```

##  License

-   The js-translate is open-sourced library licensed under the [MIT license](https://opensource.org/licenses/MIT).