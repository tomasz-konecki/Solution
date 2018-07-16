import moment from 'moment';

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

export const cutNotNeededKeysFromArray = (keys, indexes) => {
  const newKeys = [];
  for(let i = 0; i < keys.length; i++){
      if(!contains(i, indexes))
          newKeys.push(keys[i]); 
  }
  return newKeys;
}

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const updateObject = (oldObject, updatedValues) => {
  return {
      ...oldObject,
      ...updatedValues
  }
}