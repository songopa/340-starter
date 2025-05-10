class House {
    constructor(color) {
        this.color = color;
    }
    getFurniture() {
        return 'sofa';
    }
}
const houseObject = new House('red');
const houseObject2 = new House('blue');
console.log(houseObject2.getFurniture());