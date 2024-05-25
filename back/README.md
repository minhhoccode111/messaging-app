# Messaging App Back

## **Notes** [here](/notes.md)

## **Outcome**

- Used **Express**
- Used **MongoDb Atlas**
- Used **express-validator**
- Used **luxon**
- Used **debug**
- Used **dotenv**
- Used **bcrypt**
- Used **passport-jwt**
- Used **jwt**
- Used **cors**
- Used **supertest**, **jest** and **mongodb-memory-server** to implement this API using TDD
- Used **Faker** to create extensive fake data
- and more

## **Getting Started**

Development

```bash
# cd back
npm install
npm run server
```

Test

```bash
npm run test
```

Prepare production

```bash
npm run start
```

Script to interact with mongodb databases

```bash
node src/db-scripts/cleardb.js # clear
node src/db-scripts/infodb.js # info
node src/db-scripts/populatedb.js # populate
# node db-scripts/populatedb.js <some string here> # provide db string
```
