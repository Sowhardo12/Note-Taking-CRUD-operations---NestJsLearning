
## Description

Note Taking CRUD application using NestJs

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Information

API is exposed at http://localhost:3000/notes

CREATE NEW NOTE: POST

```bash
curl -X POST http://localhost:3000/notes \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Master Backend Architecture",
    "content": "Deep dive into low-level request life cycles, design patterns, and modular dependencies."
  }'
```

RETRIEVE ALL NOTES: GET 

```bash
curl -X GET http://localhost:3000/notes
```

RETRIEVE A SINGLE NOTE BY ID: GET 

```bash
curl -X GET http://localhost:3000/notes/zkl0cf3
```


UPDATE NOTE (content only): PUT

```bash
curl -X PUT http://localhost:3000/notes/zkl0cf3 \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Updated contents: Deep diving into Global Pipes, Custom Exception Filters, and Mapped Types."
  }'
```



UPDATE NOTE (title & content): PUT

```bash
curl -X PUT http://localhost:3000/notes/zkl0cf3 \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Advanced NestJS System Design",
    "content": "Refactored implementation covering robust multi-tier route abstractions."
  }'
```


REMOVE A NOTE BY ID: DELETE

```bash
curl -X DELETE http://localhost:3000/notes/zkl0cf3
```

Swagger Documentation:
```bash
http://localhost:3000/api
```




