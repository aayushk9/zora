import { OPENAI_CLIENT } from "./openai.constant";
import OpenAI from "openai";
import 'dotenv/config'; 

export const OpenAIProvider = {
    provide: OPENAI_CLIENT,
    useFactory: () => {
        return new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
    }
}