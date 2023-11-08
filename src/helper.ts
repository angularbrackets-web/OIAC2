export const isObjectEmpty = (objectName:object) => {
    return JSON.stringify(objectName) === "{}";
}