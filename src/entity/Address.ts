import {faker} from "@faker-js/faker";
import {Client} from "./Client.js";
import {Provider} from "./Provider.js";

export class Address {
    private static addresses: Address[] = [];
    public static readonly name: string = "addresses"

    private readonly uuid: string;
    private readonly country: string;
    private readonly zipCode: string;
    private readonly city: string;
    private readonly streetAddress: string;
    private clients: Client[] = [];
    private providers: Provider[] = [];

    constructor() {
        Address.addresses.push(this)

        this.uuid = faker.string.uuid()
        this.country = faker.location.country()
        this.zipCode = faker.location.zipCode()
        this.city = faker.location.city()
        this.streetAddress = faker.location.streetAddress()
    }

    getUuid() {
        return this.uuid;
    }

    addClient(client: Client) {
        if (!this.clients.some(c => c.getUuid() === client.getUuid())) {
            this.clients.push(client)
            client.setAddress(this)
        }
    }

    addProvider(provider: Provider) {
        if (!this.providers.some(p => p.getUuid() === provider.getUuid())) {
            this.providers.push(provider)
            provider.setAddress(this)
        }
    }

    toJSON() {
        return {
            country: this.country,
            zipCode: this.zipCode,
            city: this.city,
            streetAddress: this.streetAddress
        }
    }

    toJSONLeft() {
        return this.toJSON()
    }

    static getEntities() {
        return Address.addresses;
    }
}