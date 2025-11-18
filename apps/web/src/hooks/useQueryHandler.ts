import { useState } from "react";

export function useQueryHandler () {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");


    const handleUserQuery = (input: string) => {
        setQuery(input);

        // bunch of api request back and forth
        
        setResponse("hard coded reposne from dev")
    }

    return {query, response, handleUserQuery, setQuery}
}