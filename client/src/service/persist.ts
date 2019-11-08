import { JsonConvert } from "json2typescript";

const jc = new JsonConvert();

class LocalStorage {

    save<T>(key: string, obj: T): void {
        const json = JSON.stringify(jc.serialize(obj));
        localStorage.setItem(key, json);
    }

    load<T>(key: string, klass?: new () => T): T {
        const json = localStorage.getItem(key);
        return jc.deserialize<T>(JSON.parse(json), klass) as T;
    }

    delete(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}

var persist = new LocalStorage();

export default persist;

