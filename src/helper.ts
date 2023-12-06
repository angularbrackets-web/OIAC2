
export const isObjectEmpty = (objectName:object) => {
    return JSON.stringify(objectName) === "{}";
}

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


export const getMonthName = () => {
    const d = new Date()
    return month[d.getMonth()]
}

export const getMonthShortName = () => {
    const d = new Date()
    return monthShort[d.getMonth()]
}