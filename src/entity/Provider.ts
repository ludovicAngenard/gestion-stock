import {faker} from "@faker-js/faker";
import {Address} from "./Address.js";

export class Provider {
    private static providers: Provider[] = [];
    public static readonly name: string = "providers"

    private readonly uuid: string;
    private readonly name: string;
    private address: Address;

    constructor() {
        Provider.providers.push(this);

        this.uuid = faker.string.uuid();
        this.name = faker.commerce.productName();

        this.address = new Address();
        this.setAddress(this.address)
    }

    getUuid() {
        return this.uuid;
    }

    setAddress(address: Address) {
        this.address = address;
        address.addProvider(this);
    }

    toJSON() {
        return {
            uuid: this.uuid,
            name: this.name,
            address: this.address.getUuid()
        }
    }

    static getEntities() {
        return Provider.providers;
    }
}