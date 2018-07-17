import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT }
from "../constants";


export const fetchLists = (addList, baseList, helpList) => {
    return {type: FETCH_LISTS, addList, baseList, helpList}
}

export const chooseFolder = folderToGenerateReport => {
    return { type: CHOOSE_FOLDER_TO_GENERATE_REPORT, folderToGenerateReport }
}