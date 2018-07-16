export const errorCatcher = errorObject => {
    if(errorObject === undefined)
        return ["Ups, coś poszło nie tak"];

    if(errorObject.replyBlock === undefined)
        return ["Ups, coś poszło nie tak"];

    if(errorObject.replyBlock.status === 500)
        return ["Ups, coś poszło nie tak"];

    if(!errorObject.replyBlock.data)
        return ["Ups, coś poszło nie tak"];

    if(!errorObject.replyBlock.data.errorObjects)
        return ["Ups, coś poszło nie tak"];

    const keys = Object.keys(errorObject.replyBlock.data.errorObjects[0].errors);
    const error = errorObject.replyBlock.data.errorObjects[0].errors[keys[0]];

    return [error];

}