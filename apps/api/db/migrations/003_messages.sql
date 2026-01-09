CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    message_type TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT now()
)