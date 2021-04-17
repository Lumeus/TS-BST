module binarySearchTree {
    export class BinarySearchTree<T, A> {
        private leftTree: BinarySearchTree<T, A> | null;
        private rightTree: BinarySearchTree<T, A> | null;
        private key: T;
        private value: A;

        constructor(key: T, value: A) {
            this.key = key;
            this.value = value;
            this.leftTree = null;
            this.rightTree = null;
        }

        public add(key: T, value: A): BinarySearchTree<T, A> {
            if (key === this.key) {
                this.value = value;
            } else if (key < this.key) {
                if (this.leftTree == null) {
                    this.leftTree = new BinarySearchTree<T, A>(key, value);
                } else {
                    this.leftTree.add(key, value);
                }
            } else {
                if (this.rightTree == null) {
                    this.rightTree = new BinarySearchTree<T, A>(key, value);
                } else {
                    this.rightTree.add(key, value);
                }
            }
            return this;
        }

        public balance(): BinarySearchTree<T, A> {
            return this.balanceRes(this);
        }

        private balanceRes(res: BinarySearchTree<T, A>): BinarySearchTree<T, A> {
            let leftLvl: number = -1;
            let rightLvl: number = -1;
            if (res.leftTree) {
                res.leftTree = res.leftTree.balance();
                leftLvl = res.leftTree.lvl();
            }
            if (res.rightTree) {
                res.rightTree = res.rightTree.balance();
                rightLvl = res.rightTree.lvl();
            }
            if (leftLvl - rightLvl > 1) {
                res = res.rightRotate().balance();
            } else if (leftLvl - rightLvl < -1) {
                res = res.leftRotate().balance();
            }
            return res;
        }

        private rightRotate(): BinarySearchTree<T, A> {
            if (this.leftTree === null) {
                throw onerror;
            }
            const res: BinarySearchTree<T, A> = this.leftTree;
            this.leftTree = res.rightTree;
            res.rightTree = this;
            return res;
        }

        private leftRotate(): BinarySearchTree<T, A> {
            if (this.rightTree === null) {
                throw onerror;
            }
            const res: BinarySearchTree<T, A> = this.rightTree;
            this.rightTree = res.leftTree;
            res.leftTree = this;
            return res;
        }

        public lvl(): number {
            let left: number = -1;
            let right: number = -1;
            if (this.leftTree) {
                left = this.leftTree.lvl();
            }
            if (this.rightTree) {
                right = this.rightTree.lvl();
            }
            return (left > right ? left : right) + 1;
        }

        public find(key: T): A | null {
            if (this.key === key) {
                return this.value;
            }
            if (this.key > key) {
                if (this.leftTree) {
                    return this.leftTree.find(key);
                }
            }
            if (this.key < key) {
                if (this.rightTree) {
                    return this.rightTree.find(key);
                }
            }
            return null;
        }

        private leftList(): BinarySearchTree<T, A> | null {
            let res: BinarySearchTree<T, A> | null;
            if (this.leftTree) {
                res = this.leftTree.leftList();
                if (res == null) {
                    res = this.leftTree;
                    this.leftTree = res.rightTree;
                }
            } else {
                res = null;
            }
            return res;
        }

        private rightList(): BinarySearchTree<T, A> | null {
            let res: BinarySearchTree<T, A> | null;
            if (this.rightTree) {
                res = this.rightTree.rightList();
                if (res == null) {
                    res = this.rightTree;
                    this.rightTree = res.leftTree;
                }
            } else {
                res = null;
            }
            return res;
        }

        public delete(key: T): [BinarySearchTree<T, A> | null, A | null] {
            const res: [BinarySearchTree<T, A> | null, A | null] = [this, null];
            if (this.key === key) {
                let newTree: BinarySearchTree<T, A> | null = null;
                if (this.leftTree) {
                    newTree = this.leftTree.rightList();
                    if (newTree == null) {
                        newTree = this.leftTree;
                        this.leftTree = this.leftTree.leftTree;
                    }
                } else if (this.rightTree) {
                    newTree = this.rightTree.leftList();
                    if (newTree == null) {
                        newTree = this.rightTree;
                        this.rightTree = this.rightTree.rightTree;
                    }
                } else {
                    res[0] = null;
                }
                res[1] = this.value;
                if (newTree) {
                    this.key = newTree.key;
                    this.value = newTree.value;
                }
            } else if (this.key > key) {
                if (this.leftTree) {
                    [this.leftTree, res[1]] = this.leftTree.delete(key);
                }
            } else if (this.key < key) {
                if (this.rightTree) {
                    [this.rightTree, res[1]] = this.rightTree.delete(key);
                }
            }
            return res;
        }

        public toString(lvl: number = 0): string {
            let i: number;
            let res: string = "";
            if (this.rightTree) {
                res += this.rightTree.toString(lvl + 1);
            }
            for (i = 0; i < lvl; i++) {
                res += "  |";
            }
            res += "--* " + this.key + " : " + this.value + "\n";
            if (this.leftTree) {
                res += this.leftTree.toString(lvl + 1);
            }
            return res;
        }

        public toSVG(width: number, height: number): string {
            const lvl: number = this.lvl();
            const r: number = 35;
            const svgHeight: number = r * Math.pow(2, lvl);
            const svgWidth: number = svgHeight * 4;
            const vertCoef: number = 1 / (svgHeight / height);
            const horizCoef: number = 1 / (svgWidth / width);
            const coef: number = vertCoef < horizCoef ? vertCoef : horizCoef;
            return "<g transform=\"scale(" + coef + ")\">" + this.nonScaledSVG(svgWidth / 2, r + 10, r) + "</g>";
        }

        private nonScaledSVG(x: number, y: number, r: number): string {
            const lvl = this.lvl();
            let res: string = "\n";
            if (this.leftTree) {
                const xl: number = x - r * Math.pow(2, lvl);
                const yl: number = y + r * 2;
                res += "\t\t<line x1=\"" + x + "\" y1=\"" + y + "\" x2=\"" + xl + "\" y2=\"" + yl + "\" stroke=\"lightgrey\" stroke-width=\"3\" />";
                res += this.leftTree.nonScaledSVG(xl, yl, r);
            }
            if (this.rightTree) {
                const xr: number = x + r * Math.pow(2, lvl);
                const yr: number = y + r * 2;
                res += "\t\t<line x1=\"" + x + "\" y1=\"" + y + "\" x2=\"" + xr + "\" y2=\"" + yr + "\" stroke=\"lightgrey\" stroke-width=\"3\" />";
                res += this.rightTree.nonScaledSVG(xr, yr, r);
            }
            res += "\t\t<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"" + r + "\" stroke=\"lightgrey\" stroke-width=\"4\" fill=\"grey\"/>\n" +
                "\t\t<text alignment-baseline=\"middle\" text-anchor=\"middle\" fill=\"lightgrey\" x=\"" + x + "\" y=\"" + y + "\">" + this.key + "|" + this.value + "</text>";
            return res.replace("NaN", "-");
        }

        private getWidth(): number {
            let res: number = 80;
            if (this.rightTree) {
                res += this.rightTree.getWidth();
            }
            if (this.leftTree) {
                res += this.leftTree.getWidth();
            }
            return res;
        }
    }
}
