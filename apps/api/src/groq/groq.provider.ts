import { GROQ_CLIENT } from "./groq.constant";
import Groq from "groq-sdk";
import 'dotenv/config'; 

export const GROQProvider = {
    provide: GROQ_CLIENT,
    useFactory: () => {
        return new Groq({
            apiKey: process.env.GROQ_API_KEY
        })
    }
}