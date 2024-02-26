import {MongoClient} from 'mongodb'
import 'dotenv/config'
import {Client} from "./entity/Client.js";
import {Address} from "./entity/Address.js";
import {faker} from "@faker-js/faker";
import {Product} from "./entity/Product.js";
import ora from "ora";
import {Worker} from "./Worker.js";
import {Provider} from "./entity/Provider.js";
import {Order} from "./entity/Order.js";
import {OrderProduct} from "./entity/OrderProduct.js";

console.log('Host:', process.env.DB_HOST)
console.log('Port:', process.env.PORT)
console.log('DB Name:', process.env.DB_NAME)

console.time('Connection time')

// Connection URL
const url = `mongodb://${process.env.DB_HOST}:${process.env.PORT}/`;
const client = new MongoClient(url, {family: 4});

const main = async () => {
    await client.connect();
    console.time('Connected successfully to server');
    const db = client.db(process.env.DB_NAME);
    const gestionStock = db.collection('gestion-stock');
    console.timeEnd('Connection time')

    console.time("Cleaning up the database")
    await gestionStock.deleteMany({});
    console.timeEnd("Cleaning up the database")

    await gestionStock.insertOne({
        clients: [],
        addresses: [],
        products: [],
        providers: [],
        orders: [],
        orderProducts: []
    })

    console.time('Generating data')

    const numberOfClients = faker.number.int({min: 700, max: 1000})
    const spinner = ora(`Generating client (0/${numberOfClients})`).start();
    Array.from({length: numberOfClients}).map((_, index) => {
        const client = new Client()
        spinner.text = `Generating client (${index + 1}/${numberOfClients})`
        if (index % 11 === 0) {
            spinner.render()
        }
        return client
    })
    spinner.succeed()

    const numberOfProvider = faker.number.int({min: 100, max: 200})
    spinner.text = `Generating provider (0/${numberOfProvider})`
    Array.from({length: numberOfProvider}).map((_, index) => {
        const provider = new Provider()
        spinner.text = `Generating provider (${index + 1}/${numberOfProvider})`
        if (index % 11 === 0) {
            spinner.render()
        }
        return provider
    })
    spinner.succeed()

    const numberOfProduct = faker.number.int({min: 250, max: 500})
    spinner.text = `Generating product (0/${numberOfProduct})`
    Array.from({length: numberOfProduct}).map((_, index) => {
        const product = new Product()
        spinner.text = `Generating product (${index + 1}/${numberOfProduct})`
        if (index % 11 === 0) {
            spinner.render()
        }
        return product
    })
    spinner.succeed()

    spinner.text = `Create order for client (0/${Client.getEntities().length})`
    Client.getEntities().forEach((client, index) => {
        const numberOfOrder = faker.number.int({min: 0, max: 3})

        Array.from({length: numberOfOrder}).forEach(() => {
            const order = new Order(client)
            client.addOrder(order)
        })

        spinner.text = `Create order for client (${index + 1}/${Client.getEntities().length})`
        if (index % 11 === 0) {
            spinner.render()
        }
    })
    spinner.succeed()

    console.timeEnd('Generating data')

    console.time('Insert time')
    const worker = new Worker(spinner)
    worker.addSaveEntity(gestionStock, [Client, Address, Product, Provider, Order, OrderProduct])
    await worker.save()
    console.timeEnd('Insert time')
};

main()
    .catch(console.error)
    .finally(() => client.close());