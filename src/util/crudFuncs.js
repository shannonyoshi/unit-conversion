

export const postSuggestion = async (suggestionString)=> {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'none',
        },
        body: JSON.stringify({suggestion: suggestionString})
    }
    const response = await fetch('http://localhost:8080', request)
        if (!response.ok) {
            console.log(response)
        }
    const data = await response.json()
    console.log("POST RESPONSE DATA: ", data)
}