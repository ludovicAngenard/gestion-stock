import {faker} from "@faker-js/faker";
import {OrderProduct} from "./OrderProduct.js";

export class Product {
    private static products: Product[] = [];
    public static readonly name: string = "products"

    private readonly uuid: string;
    private readonly name: string;
    private readonly price: number;
    private readonly description: string;
    private orderProducts: OrderProduct[] = [];

    constructor() {
        Product.products.push(this);

        this.uuid = faker.string.uuid();
        this.name = faker.commerce.productName();
        this.price = faker.number.float({
            min: 1,
            max: 500,
            fractionDigits: 2
        });
        this.description = faker.commerce.productDescription();
    }

    getUuid() {
        return this.uuid;
    }

    addOrderProduct(orderProduct: OrderProduct) {
        if (!this.orderProducts.some(op => op.getUuid() === orderProduct.getUuid())) {
            this.orderProducts.push(orderProduct)
            orderProduct.setProduct(this)
        }
    }

    toJSON() {
        return {
            uuid: this.uuid,
            name: this.name,
            price: this.price,
            description: this.description,
            orderProducts: this.orderProducts.map(orderProduct => orderProduct.getUuid())
        }
    }

    static getEntities() {
        return Product.products;
    }
}