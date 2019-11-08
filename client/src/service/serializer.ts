import * as _ from 'lodash';
import { JsonConvert } from 'json2typescript';

const convert = new JsonConvert();
const ClassIdentifier = '__jsonconvert__class_identifier__';

function isTypedObject(o: any): boolean {
    const proto = o && Object.getPrototypeOf(o);
    return proto && proto.hasOwnProperty(ClassIdentifier);
}

function isTypedArray(o: any[]): boolean {
    return _.every(o, isTypedObject);
}

export function serialize(obj: any): any {
    let ret: any;
    if (isTypedObject(obj) || isTypedArray(obj)) {
        ret = convert.serialize(obj);
    } else {
        ret = obj;
    }
    return ret;
}

export function deserialize<T>(obj: any, klass: new () => T): T | T[] {
    let ret: T | T[];
    if (klass) {
        ret = convert.deserialize<T>(obj, klass);
    } else {
        ret = obj instanceof Array ? <T[]>obj : <T>obj;
    }
    return ret;
}
