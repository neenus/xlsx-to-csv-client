<!-- Generate a README.md file -->

# XLSX to CSV Converter App

This is the frontend application for the XLSX to CSV Converter App. It was originally bootstraped using Create-React-App and it has been converted to Vite React with Typescript support.

## Features

- Upload specific use XLSX file to server
- Server converts XLSX file to CSV file and sends it back to client
- Client displays converted CSV file information with a link to download the file

## Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [Netlify](https://www.netlify.com/)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- NPM 6.x or higher or Yarn 1.22.x or higher

### Installation

1. Clone the repo

```sh
git clone git@github.com:neenus/xlsx-to-csv-client.git
```

2. Install NPM packages

```sh
npm install
```

or

```sh
yarn install
```

3. Create a `.env` file in the root directory and add the following environment variables

```sh
VITE_API_BASE_URL=(API base URL goes here)
VITE_VERSION=$npm_package_version
```

4. Start the development server

```sh
npm run dev
```

or

```sh
yarn dev
```

5. Open the app in your browser

```sh
http://localhost:3000
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open http://localhost:3000 to view it in the browser.\

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed! See the section about [deployment](https://vitejs.dev/guide/build.html#deployment) for more information.

### `npm run lint`

Runs ESLint to check for linting errors. See https://eslint.org/ for more information.

### `npm run preview`

Runs the app in the production mode. The page will reload if you make edits.

## License

Distributed under the MIT License. See https://opensource.org/licenses/MIT for more information.
