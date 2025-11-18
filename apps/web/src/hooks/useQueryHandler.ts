import { useState } from "react";

export function useQueryHandler () {
    const [queries, setQueries] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);


    const handleUserQuery = (input: string) => {
        setQueries(prev => [...prev, input]);

        // bunch of api request back and fourth
        
        setResponses(prev => [...prev])
    }
    return {queries, responses, handleUserQuery, setQueries}
}