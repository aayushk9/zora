CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_type TEXT CHECK(message_type IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id
   ON messages(conversation_id);