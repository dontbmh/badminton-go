import { Any, JsonObject, JsonProperty } from 'json2typescript';

export function JProperty(nameOrTypeOrConv?: string | any, typeOrConv?: any) {
    return function (target: any, name: string) {
        let propName, propType;
        if (typeof (nameOrTypeOrConv) === 'string') {
            propName = nameOrTypeOrConv || name;
            propType = typeOrConv || Any;
        } else {
            propName = name;
            propType = nameOrTypeOrConv || Any;
        }
        return JsonProperty(propName, propType, true)(target, name);
    };
}

export function JObject() {
    return JsonObject();
}