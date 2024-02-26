import {faker} from "@faker-js/faker";
import {Order} from "./Order.js";
import {Product} from "./Product.js";

export class OrderProduct {
    private static orderProducts: OrderProduct[] = [];
    public static readonly name: string = "orderProducts"

    private readonly uuid: string;
    private readonly quantity: number;
    private product: Product;
    private order: Order;

    constructor(order: Order) {
        OrderProduct.orderProducts.push(this);

        this.uuid = faker.string.uuid();
        this.quantity = faker.number.int({min: 1, max: 15});

        this.product = faker.helpers.arrayElement(Product.getEntities());
        this.setProduct(this.product);

        this.order = order;
        this.setOrder(order)
    }

    getUuid() {
        return this.uuid;
    }

    setOrder(order: Order) {
        this.order = order;
        order.addOrderProduct(this);
    }

    setProduct(product: Product) {
        this.product = product;
        product.addOrderProduct(this);
    }

    toJSON() {
        return {
            quantity: this.quantity,
        }
    }

    toJSONLeftForOrder() {
        return {
            ...this.toJSON(),
            product: this.product.getUuid()
        }
    }

    toJSONLeftForProduct() {
        return {
            ...this.toJSON(),
            order: this.order.getUuid()
        }
    }

    static getEntities() {
        return OrderProduct.orderProducts;
    }
}