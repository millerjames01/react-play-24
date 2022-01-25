# Play 24

![Play 24 Screenshot]()

This is a demo project built to practice using the React framework with an Express server.

**Play 24** is a web-based version of the class puzzle game [24](https://en.wikipedia.org/wiki/24_(puzzle)).
Given four numbers from 1 to 9, you have to use four basic operations to combine them to get the number 24.
You can use parentheses as well to affect the order of operations.

The back-end is written with [Express](https://expressjs.com) and the front-end with [React](https://reactjs.org).

## How to run

To run this project, you'll need `npm` 
([install info. here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)).

In the central directory run:

    npm run dev

Your default browser should open to [localhost:3000](http:/localhost:3000).

## Project Structure

The server application runs from `app.js`, using a single-route Express server in `server.js`.
Additionally, the full set of problems is stored in `problem-set.txt`, which is read into memory
with the puzzles object from `puzzles.js`.

The client-side is a React project contained within the `client` folder. The UI is written in `src/App.js`
and styled by `src/App.css`.

The server runs on port 8080 and the React application runs on 3000. 
They communicate back and forth using cross-origin resource sharing.

## Tests

On there way!

## Ideas for Future Improvement

I wrote this project with the goal of practicing writing React components, so building a fully functional web app was not necessarily my objective. 
Here are some ideas that I might implement in the future or any future learners might try developing on their own:

* Adding a leaderboard or score counter, stored either in a database or using local storage.
* Refining the parenthesis mechanics, which is a bit clunky now. Having a retroactive parenthesis around button is a solid idea.
* Breaking up the React components into separate files. 
  They aren't reused anywhere, but it might give the app an easier structure to follow.

## Contact
If you have any questions about how the site functions or ideas for suggestion, feel free to reach out to me on here or at
[miller.james01@gmail.com](mailto:miller.james01@gmail.com).
