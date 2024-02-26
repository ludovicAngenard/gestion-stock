import {faker} from "@faker-js/faker";
import {OrderProduct} from "./OrderProduct.js";
import {Provider} from "./Provider.js";

export class Product {
    private static products: Product[] = [];
    public static readonly name: string = "products"

    private readonly uuid: string;
    private readonly name: string;
    private readonly price: number;
    private readonly quantity: number;
    private readonly description: string;
    private orderProducts: OrderProduct[] = [];
    private provider: Provider;

    constructor() {
        Product.products.push(this);

        this.uuid = faker.string.uuid();
        this.name = faker.commerce.productName();
        this.quantity = faker.number.int({min: 0, max: 100});
        this.price = faker.number.float({
            min: 1,
            max: 500,
            fractionDigits: 2
        });
        this.description = faker.commerce.productDescription();

        this.provider = faker.helpers.arrayElement(Provider.getEntities());
        this.setProvider(this.provider);
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

    setProvider(provider: Provider) {
        this.provider = provider;
        provider.addProduct(this);
    }

    toJSON() {
        return {
            uuid: this.uuid,
            name: this.name,
            price: this.price,
            quantity: this.quantity,
            description: this.description,
            provider: this.provider.getUuid(),
            orderProducts: this.orderProducts.map(orderProduct => orderProduct.toJSONForProduct())
        }
    }

    static getEntities() {
        return Product.products;
    }
}