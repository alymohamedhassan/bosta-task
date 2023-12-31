# Bosta API

# Setup
## Development Mode

```$ docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d```

## Production mode

```$ docker compose up --build -d```

# API Documentation
``` Nestjs supports swagger api documentation out of the box by using the library annotations```
To access the documentation: ```/docs```


# Decision documentation

## Database Schema

    I created a separate table for authors due to multiple reasons:
        - Normalization
        
        - Scalability
            As mentioned in the documentation received, the design should be scalable when adding modules like reviews, or 
        reservations, however it was not clear whether the reviews was for the books, the authors, or both.

    


