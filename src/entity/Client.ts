import {faker} from "@faker-js/faker";
import {Address} from "./Address.js";
import {Order} from "./Order.js";

export class Client {
    private static clients: Client[] = [];
    public static readonly name: string = "clients"

    private readonly uuid: string;
    private readonly firstName: string;
    private readonly lastName: string;
    private readonly email: string;
    private readonly dateOfBirth: Date;
    private address: Address;
    private orders: Order[] = [];

    constructor() {
        Client.clients.push(this);

        this.uuid = faker.string.uuid();
        this.firstName = faker.person.firstName();
        this.lastName = faker.person.lastName();
        this.email = faker.internet.email();
        this.dateOfBirth = faker.date.past();

        this.address = new Address();
        this.setAddress(this.address)
    }

    getUuid() {
        return this.uuid;
    }

    setAddress(address: Address) {
        this.address = address;
        address.addClient(this);
    }

    addOrder(order: Order) {
        this.orders.push(order);
        order.setClient(this);
    }

    toJSON() {
        return {
            uuid: this.uuid,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            dateOfBirth: this.dateOfBirth.toISOString(),
            address: this.address.toJSON(),
            orders: this.orders.map(order => order.getUuid())
        }
    }

    static getEntities() {
        return Client.clients;
    }
}