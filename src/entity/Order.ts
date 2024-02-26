import {faker} from "@faker-js/faker";
import {Client} from "./Client.js";
import {OrderProduct} from "./OrderProduct.js";

export class Order {
    private static orders: Order[] = [];
    public static readonly name: string = "orders"

    private readonly uuid: string;
    private client: Client;
    private orderProducts: OrderProduct[] = [];

    constructor(client: Client) {
        Order.orders.push(this);

        this.uuid = faker.string.uuid();

        this.client = client;
        this.setClient(client)

        for (let i = 0; i < faker.number.int({min: 1, max: 4}); i++) {
            this.addOrderProduct(new OrderProduct(this))
        }
    }

    getUuid() {
        return this.uuid;
    }

    setClient(client: Client) {
        this.client = client;
    }

    addOrderProduct(orderProduct: OrderProduct) {
        if (!this.orderProducts.some(op => op.getUuid() === orderProduct.getUuid())) {
            this.orderProducts.push(orderProduct)
            orderProduct.setOrder(this)
        }
    }

    toJSONLeft() {
        return {
            uuid: this.uuid,
            client: this.client.getUuid(),
            orderProducts: this.orderProducts.map(orderProduct => orderProduct.toJSONLeftForOrder())
        }
    }

    static getEntities() {
        return Order.orders;
    }
}