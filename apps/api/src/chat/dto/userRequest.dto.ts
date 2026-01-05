import { SelectedEventsDto } from "src/generate-prompts/dto/selected-events.dto";

export class userRequest {
    userQuery: {
        role: "user" | 'agent',
        content: string
    };
}