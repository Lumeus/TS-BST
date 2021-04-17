module index {
    import BinarySearchTree = binarySearchTree.BinarySearchTree;

    function add(key: number, value: number, width: number, height: number): void {
        if (tree) {
            tree.add(key, value);
        } else {
            tree = new BinarySearchTree(key, value);
        }
        // @ts-ignore
        svg.innerHTML = tree.toSVG(width, height);  // точно не null
    }

    function del(key: number, width: number, height: number): void {
        if (tree) {
            let res: number | null;
            [tree, res] = tree.delete(key);
            // @ts-ignore
            document.getElementById("del-res").innerHTML = (res != null && !isNaN(res)) ? res.toString() : "-";  // точно не null
        } else {
            // @ts-ignore
            document.getElementById("del-res").innerHTML = "tree is missing"; // точно не null
        }
        // @ts-ignore
        svg.innerHTML = tree ? tree.toSVG(width, height) : "";  // точно не null
    }

    function find(key: number): void {
        if (tree) {
            const res: number | null = tree.find(key);
            let result: string = "-";
            if (res != null && !isNaN(res)) {
                result = res.toString();
            }
            // @ts-ignore
            document.getElementById("find-res").innerHTML = result;  // точно не null
        } else {
            // @ts-ignore
            document.getElementById("find-res").innerHTML = "tree is missing";  // точно не null
        }
    }

    function balance(width: number, height: number): void {
        if (tree) {
            tree = tree.balance();
            // @ts-ignore
            svg.innerHTML = tree.toSVG(width, height);  // точно не null
        }
    }

    function handleChange(event: HTMLInputElement): void {
        let value: number = parseFloat(event.value);
        if (value < -99) {
            value = -99;
        }
        if (value > 99) {
            value = 99;
        }
        event.value = value.toFixed(0);
    }

    function click(event: HTMLInputElement): void {
        event.value = "";
    }

    function createListeners(): void {
        svg = document.getElementById("svg");
        if (svg && tree) {
            svg.innerHTML = tree.toSVG(1000, 700);
        }
        const addKey = <HTMLInputElement>document.getElementById("add-key");
        if (addKey) {
            addKey.onclick = () => {click(<HTMLInputElement>document.getElementById("add-key")); };
            addKey.onchange = () => {handleChange(<HTMLInputElement>document.getElementById("add-key")); };
        }
        const addVal = <HTMLInputElement>document.getElementById("add-val");
        if (addVal) {
            addVal.onclick = () => {click(<HTMLInputElement>document.getElementById("add-val")); };
            addVal.onchange = () => {handleChange(<HTMLInputElement>document.getElementById("add-val")); };
        }
        const findKey = <HTMLInputElement>document.getElementById("find-key");
        if (findKey) {
            findKey.onclick = () => {click(<HTMLInputElement>document.getElementById("find-key")); };
            findKey.onchange = () => {handleChange(<HTMLInputElement>document.getElementById("find-key")); };
        }
        const delKey = <HTMLInputElement>document.getElementById("del-key");
        if (delKey) {
            delKey.onclick = () => {click(<HTMLInputElement>document.getElementById("del-key")); };
            delKey.onchange = () => {handleChange(<HTMLInputElement>document.getElementById("del-key")); };
        }
        const addButton = document.getElementById("add");
        if (addButton) {
            addButton.onclick = () => { if (addKey.value !== "" && addVal.value !== "") {
                add(parseFloat(addKey.value), parseFloat(addVal.value), 1000, 700);
            } };
        }
        const findButton = document.getElementById("find");
        if (findButton) {
            findButton.onclick = () => { if (findKey.value !== "") {
                find(parseFloat(findKey.value));
            } };
        }
        const delButton = document.getElementById("del");
        if (delButton) {
            delButton.onclick = () => { if (findKey.value !== "") {
                del(parseFloat(delKey.value), 1000, 700);
            } };
        }
        const balButton = document.getElementById("bal");
        if (balButton) {
            balButton.onclick = () => { balance(1000, 700); };
        }
    }

    let svg: HTMLElement | null;
    let tree: BinarySearchTree<number, number> | null = null;
    document.addEventListener("DOMContentLoaded", createListeners);
}
