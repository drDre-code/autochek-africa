# AUTOCHEK-AFRICA

This contains a task using data from Hacker News API.

It is written in typescript.

As this is a node project, you would need to install dependencies using `yarn` (preferred), but `npm` would also work. Run

```bash
yarn # Or, npm install if you want to use npm
```

To start the server, you need to compile the code to javascript, run
```bash
yarn build
```

or

```bash
yarn tsc
```


Then, to start the server, run
```bash
yarn start
```

or

```bash
node bin/www
```
The server runs on  `http://localhost:5000`

## Documentation
There are only three basic routes in this project.

1. To get Top 10 most occurring words in the titles of the last 25 stories,
    the endpoint is `http://localhost:5000/t10-last-25`
    and the response is a json object with the words as keys and the amount of times they occur as values.


2. To get Top 10 most occurring words in the titles of the post of exactly the last week,
    the endpoint is `http://localhost:5000/t10-last-weeks`
    and the response is a json object which is empty as the stories from the API are dated as far back as 1970. and would therefore result in an empty json object

3. To get Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma,
    the endpoint is `http://localhost:5000/t10-last-600stories`
    and the response is a json object with the words as keys and the amount of times they occur as values.

