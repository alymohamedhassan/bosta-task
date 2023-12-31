# Bosta API


# Setup
## Development Mode

##### I recommend using the Development mode to load seed data automatically.
```$ docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d```


## Production mode

```$ docker compose up --build -d```


# API Documentation
``` Nestjs supports swagger api documentation out of the box by using the library annotations```

    To access the documentation: ```/docs```


# Decision documentation

## Database Schema
    - I created a separate table for authors due to multiple reasons:
        - Normalization
        - Scalability
            As mentioned in the documentation received, the design should be scalable when adding modules like reviews, or 
        reservations, however it was not clear whether the reviews was for the books, the authors, or both.
    
    - Performance:
        Indexed the following fields in book:
        - title
        - isbn 
        - authorId

        Indexed the following fields in author:
        - name

        ```These are the most used fields when searching for books, and authors```
    

## Rate limiting
    1 - I applied it on borrower registration and creating new borrowing process.
    2 - I chose to implement rate limiting as a separate guard that accepts specific paths to apply the rules to it.
    3 - Since the application is simple, it was ideal to allow the rate limit number to be passed as an env.
    4 - I chose redis to support scalability, if this service was a distributed service with multiple instances.


## Security
    - SQL Injection is handled by the ORM (prisma)
    - Validation is handled by nestjs and the class-validator modules

