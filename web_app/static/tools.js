

export function setNestedValue(obj, keys, value) {
    keys.reduce((o, key, index) => {
        if (index === keys.length - 1) {
            o[key] = value; // assign value to the last key
        } else {
            if (!o[key]) o[key] = {}; // create an object if it doesn't exist
        }
        return o[key];
    }, obj);
}