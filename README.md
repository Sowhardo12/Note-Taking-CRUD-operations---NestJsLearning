
## Description of project

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
http://localhost:3000/docs
```

---

## The Mortality Experiment

1. Use `curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" -d '{"title":"Temporary Note","content":"Poof!"}'` to write a new note.
2. Verify its existence using `curl http://localhost:3000/notes`.
3. Stop your local terminal server engine (`Ctrl + C`) and restart it using `npm run start:dev`.
4. Fire a fresh read tracking parameter: `curl http://localhost:3000/notes`.

### Why did the data disappear?
When a server is running, the in memory data of the server are volatile. If power goes off
or server is turned off, those data are cleaned from the heap memory. So when next time the
server is alive, the old data is gone. This is why we use Database where the data is decoupled
from the server and lives inside non-volatile memory like SSD/HDD.

---

## Search and Query Filtering

```bash
curl -X GET "http://localhost:3000/notes?search=milk"
```
## Force Reset to System Baseline

```bash
curl -X POST http://localhost:3000/notes/reset
```



