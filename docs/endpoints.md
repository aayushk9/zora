# API Endpoints

## GET

1) [PROTECTED ENDPOINT]`/api/conversations` 
    send > credentials (token)
         
    receive > conversationId
            > conversation title
    
    we get Data from server (db call)

2) [PROTECTED ENDPOINT] `/api/auth/me`
     send > credentials {token}
     recieve > user details for logging interfaces
     set user = data.email

## POST

1) [PROTECTED ENDPOINT] `/api/chat` 
     send  > token (from cookies accessed via credentials) (which extracts userId)
           > empty conversationId at first user query in current comversation (than server sends newly created conversation id to client and client has it in url via `query/data.id`) so from next request onwards we send ths conversationId in every request cycle
           > user query (sanitized)
           > selected events ? null

    recieve > conversationId
            > conversation title
            > agent response
            > message_id
   
   (empty conversationId, user request, selected events and a jwt via credentials(backend creates conversation id for the first time and saves in db from than on checks if conversation id existd if yes continue else create)) to backend & from backend to selected llm for computation and in return selected llm responds with o/p from server (LLM)

2) [PROTECTED ENDPOINT] `/api/chat/history` 
   send  > token (from cookies accessed via credentials) (which extracts userId)
         > conversationId
    
   receive > message_id
           > message_type
           > content (user queries and agent responses)
           > selected events with first user query (if any) : null

    we get DATA from server (db call)

3) `api/auth`
    send > email
         > password
    
    recieve > jwt token in browser [`cookie: jwt <token>`]


4) `api/v1/events` 
     send > activeCategory
          > start
          > end

    recieve > huge data filtered through [`active category, start, end`]

    we get DATA from server (external api call to jup prediction market)

5) `/api/generate-prompts` 
      send > selected events

      recieve > 5 prompts related to selected events

      we get Data from server (LLM)

6) [PROTECTED ENDPOINT] `/api/auth/logout`
    send > token
    clears jwt from cookies
    set user = null

Internal backedn request redirected from client

 `api/auth/google`
    send > just redirect to backend nothing to be sent from client
    
    server manages internals from setting google credentials, interacting with google's server and fetching user details from google, saving them in db if new user and generate jwt

    recieve > jwt in browser [`cookie: jwt<token>`]