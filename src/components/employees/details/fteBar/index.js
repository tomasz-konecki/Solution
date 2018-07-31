
export const valuesArray = [
    {mark: "", percentage: 0},
    {mark: "1/5", percentage: 0.2}, 
    {mark: "1/4", percentage: 0.25},
    {mark: "1/2", percentage: 0.5},
    {mark: "3/4", percentage: 0.75},
    {mark: "FTE", percentage: 1}
]
export const calculateFteBarWidth = incomingPercentage => {
    for(let key in valuesArray)
        if(valuesArray[key].percentage === incomingPercentage)
            return valuesArray[key]
}
