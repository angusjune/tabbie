import LZString from 'lz-string';

export interface StorageValues {
    [key: string]: string | number | boolean;
}

type StorageType = 'local' | 'sync';
type Migration<Values extends StorageValues> = (
    savedValues: Values,
    defaults: Values,
) => Promise<void> | void;

interface Setup<Values extends StorageValues> {
    defaults: Values;
    migrations?: Array<Migration<Values>>;
    storageName?: string;
    storageType?: StorageType;
}

export default class OptionsStorage<Values extends StorageValues> {
    static migrations = {
        removeUnused(values: StorageValues, defaults: StorageValues) {
            for (const key of Object.keys(values)) {
                if (!(key in defaults)) {
                    delete values[key];
                }
            }
        },
    };

    readonly defaults: Values;
    readonly storageName: string;
    readonly storageType: StorageType;

    private readonly migrations: Promise<void>;

    constructor({
        defaults,
        migrations = [],
        storageName = 'options',
        storageType = 'sync',
    }: Setup<Values>) {
        this.defaults = defaults;
        this.storageName = storageName;
        this.storageType = storageType;
        this.migrations = this.runMigrations(migrations);
    }

    async getAll(): Promise<Values> {
        await this.migrations;
        return this.getStoredValues();
    }

    async set(values: Partial<Values>): Promise<void> {
        await this.setAll({
            ...await this.getAll(),
            ...values,
        });
    }

    decode(storedValues: unknown): Values {
        let values = storedValues;

        // webext-options-sync 4.x stored its payload as an LZ-compressed string.
        if (typeof storedValues === 'string') {
            const json = LZString.decompressFromEncodedURIComponent(storedValues);
            values = json ? JSON.parse(json) : {};
        }

        return {
            ...this.defaults,
            ...(values && typeof values === 'object' ? values : {}),
        };
    }

    private get storage(): chrome.storage.StorageArea {
        return chrome.storage[this.storageType];
    }

    private async getStoredValues(): Promise<Values> {
        const result = await this.storage.get(this.storageName);
        return this.decode(result[this.storageName]);
    }

    private async setAll(values: Values): Promise<void> {
        const valuesWithoutDefaults: Partial<Values> = { ...values };

        for (const key of Object.keys(valuesWithoutDefaults)) {
            if (valuesWithoutDefaults[key] === this.defaults[key]) {
                delete valuesWithoutDefaults[key];
            }
        }

        await this.storage.set({
            [this.storageName]: valuesWithoutDefaults,
        });
    }

    private async runMigrations(
        migrations: Array<Migration<Values>>,
    ): Promise<void> {
        if (migrations.length === 0) {
            return;
        }

        const values = await this.getStoredValues();
        const initialValues = JSON.stringify(values);

        for (const migrate of migrations) {
            await migrate(values, this.defaults);
        }

        if (JSON.stringify(values) !== initialValues) {
            await this.setAll(values);
        }
    }
}
