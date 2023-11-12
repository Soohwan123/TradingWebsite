const customFetch = async (gqlQuery) => {
    let response;
    try {
        response = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ query: gqlQuery }),
        });
    } catch (err) {
        console.error(err);
    }

    return response;
}

export function rowMaker(key, alert) {
    let newRow = {key: key, country : alert.name, alertInfo : 
    <>
    {alert.text}
    <br />
    {alert.date}
    </>};

    return newRow;
}

export function removeDuplicatesInArray(array) {
    let arraySet = new Set(array);
    let updatedArray = Array.from(arraySet);

    return updatedArray;
}

export default customFetch;