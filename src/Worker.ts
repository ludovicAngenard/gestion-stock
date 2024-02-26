import {Ora} from "ora";
import {Collection} from "mongodb";

export class Worker {

    private spinner: Ora;
    private total: number = 0;
    private end: number = 0;
    private toLoad: (() => Promise<void>)[] = []

    constructor(spinner: Ora) {
        this.spinner = spinner;
    }

    addSaveEntity<E extends {
        name: string
        getEntities: () => {
            toJSON: () => unknown
        }[]
    }>(collection: Collection, entities: E[]) {
        for (const entity of entities) {
            for (const e of entity.getEntities()) {
                this.toLoad.push(async () => {
                    await collection.updateOne({}, {
                        $push: {
                            [entity.name]: e.toJSON()
                        }
                    })
                })
                this.total++
            }
        }
    }

    async save() {
        this.spinner.start(`Inserting (${this.end}/${this.total})`)
        const inserts = Array.from({length: 10}).map(() => {
            return new Promise(async (resolve) => {
                while (this.toLoad.length > 0) {
                    const toLo = this.toLoad.shift()
                    if (toLo) {
                        await toLo()
                        this.end++
                        this.spinner.text = `Inserting in database (${this.end}/${this.total})`
                        if (this.toLoad.length % 11 === 0) {
                            this.spinner.render()
                        }
                    }
                }
                resolve(undefined)
            })
        })
        await Promise.all(inserts)
        this.spinner.succeed()
    }
}