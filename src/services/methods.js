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
export const isArrayContainsByObjectKey = (array, element) => {
  for(let i = 0; i < array.length; i++){
    if(array[i].obj.skillName === element)
      return true;
  }
  return false;
}


export const prepareToLongStringToShow = (optimalLength, incomingWord) => {
  let returnWord = "";

  if(incomingWord.length > optimalLength){
    for(let i = 0; i < optimalLength; i++)
      returnWord += incomingWord.charAt(i);
    
    returnWord = returnWord + "...";
  }
  
  else
    returnWord = incomingWord;

  return returnWord;

}

export const checkForContains = (currentEmployeeSkills, name) => {
  for(let key in currentEmployeeSkills){
    if(currentEmployeeSkills[key].name === name)
      return true;
  }
  return false;
}


export const populateSkillArrayWithConstData = skills => {
  const newSkills = [];
  for(let key in skills){
    newSkills.push({
      "skillId": skills[key].key,
      "skillLevel": 1,
      "yearsOfExperience": 1
    })
  }
  return newSkills
}

export const clearAfterTimeByFuncRef = (funcRef, delay, ...params) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(funcRef(...params))
    }, delay);
  }
}

export function generateSortFunction(key, ascending){
  return function sortByKey(a, b){
    return ascending ? a[key] - b[key] : b[key] - a[key];
  }
} 

export function sortStrings(key){
  return function(a,b){
    var x = a[key].toLowerCase();
    var y = b[key].toLowerCase();

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  }
}


export const refreshPage = () => {
  window.location.href = window.location.href;
}

export const clearDataOfForm = formItems => {
  for(let key in formItems){
    if(formItems[key].mode !== "date-picker"){
      formItems[key].value = "";
    }
    else{
      formItems[key].value = moment();
    }

    formItems[key].error = "";
  }
}

export const extractFromItemsWantedAttributes = (attributes, items) => {
  const copiedItems = [...items];
  if(attributes){
      const allKeysOfItems = Object.keys(copiedItems);
      const newItems = [];

      for(let i = 0; i < copiedItems.length; i++){
          const newObject = {};
          for(let j = 0; j < attributes.length; j++){
              const isAttributesInKeysList = allKeysOfItems.findIndex(el => el === attributes[j]);
              if(isAttributesInKeysList){
                  const actualValue = copiedItems[i][attributes[j]];
                  if (typeof actualValue ===  "string" || typeof actualValue ===  "number" || typeof actualValue ===  "bollean"){
                      newObject[attributes[j]] = actualValue;
                  }
                  else{
                      newObject[attributes[j]] = JSON.parse(JSON.stringify(actualValue));
                  }
              }
          }
          newItems.push(newObject);
      }
      return newItems;
  }
  return copiedItems;
}

export const getEmployeeId = () => {
  const url = window.location.href;
  const indexOfLastEqual = url.lastIndexOf("=");
  if(indexOfLastEqual === -1){
    return "";
  }
 
  return window.location.href.substring(indexOfLastEqual+1, url.length);
}

export const pushMomentValuesDynamicly = (limit, startDate, numberOfAdds, valueType, format) => {
  const startMomentDate = moment(startDate);
  const items = [];
  for(let i = 0; i < limit; i++){
      const formatedDate = startMomentDate.add(numberOfAdds, valueType).format(format);

      items.push({name: formatedDate, id: i});
  }
  return items;
}

export const doSomethingAfterDelay = (timeout, functionReference, ...params) => {
  setTimeout(() => {
    functionReference(...params)
  }, timeout);
}