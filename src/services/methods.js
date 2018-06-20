export const mapObjectKeysToArrayByGivenIndexes = (objectToMap, indexes) => {
    const newArray = [];
    const keys = Object.keys(objectToMap);
    for(let i = 0; i < keys.length; i++){
      if(contains(i, indexes))
        newArray.push(keys[i]);
    }

    return newArray;
}
export const contains = (element, array) => {
    for(let i = 0; i < array.length; i++)
      if(array[i] === element)
        return true;

return false;
}
