

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

export function weightedRandomSelection(value) {
    const n = value;
    const weights = Array.from({ length: n }, (_, index) => n - index); // Higher weight for lower index
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    
    const randomNum = Math.random() * totalWeight; // Random number between 0 and totalWeight
    let cumulativeWeight = 0;

    for (let i = 0; i < n; i++) {
        cumulativeWeight += weights[i];
        if (randomNum <= cumulativeWeight) {
            return i; // Return the selected item
        }
    }
}

export function firstLetterUpperCase(text) {
    if (text.length > 0 && text[0].toUpperCase() === text[0]) { return true;}
    return false;
}
