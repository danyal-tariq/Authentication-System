# Authentication-System

Basic Auth System using Next.js and Express Backend

## Features

- Sign up, Sign in, Reset Password using Email Verification.
- User authentication with JWT
- RESTful API using Express
- MongoDB for data storage
- Custom Mongoose plugins for pagination and JSON transformation
- Integration with Tailwind CSS for styling
- Next.js for server-side rendering and static site generation
- Docker support for containerization
- Linting with ESLint and Prettier
- Unit and integration tests with Jest
- Continuous integration with Travis CI
- API documentation with Swagger
- Advanced production process management with PM2
- Security enhancements with Helmet, xss-clean, and express-mongo-sanitize
- CORS enabled using cors
- Gzip compression with compression
- Git hooks with Husky and lint-staged

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/danyal-tariq/Authentication-System.git
   cd authentication-system
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp backend/.env.example backend/.env
   ```

4. Modify the [`.env`] files with your configuration.

### Running the Development Server

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running with Docker

1. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Commands

### Backend

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

### Frontend

Running locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Environment Variables

The environment variables can be found and modified in the [`.env`] file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate
```

## Project Structure

```
backend/
	.dockerignore
	.editorconfig
	.env
	.env.example
	.eslintignore
	.eslintrc.json
	.gitattributes
	.gitignore
	.husky/
	.lintstagedrc.json
	.prettierignore
	.prettierrc.json
	.travis.yml
	docker-compose.dev.yml
	docker-compose.prod.yml
	docker-compose.test.yml
	docker-compose.yml
	Dockerfile
	ecosystem.config.json
	jest.config.js
	LICENSE
	package.json
	README.md
	src/
	tests/
frontend/
	.eslintrc.json
	.gitignore
	.gitkeep
	.next/
	components.json
	next-env.d.ts
	...
LICENSE
README.md
```

## API Documentation

API documentation is generated using Swagger. You can access the documentation at `/v1/docs`.

## Error Handling

Centralized error handling mechanism is implemented using custom [`ApiError`] class and middleware.

## Validation

Request data validation is done using Joi.

## Authentication

JWT authentication is implemented using Passport.

## Authorization

Role-based authorization is implemented using custom middleware.

## Logging

Logging is done using Winston and Morgan.

## Custom Mongoose Plugins

Custom Mongoose plugins for pagination and JSON transformation are used.

## Linting

Linting is done using ESLint and Prettier.

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## License

MIT

## Inspirations

- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [madhums/node-express-mongoose](https://github.com/madhums/node-express-mongoose)
- [kunalkapadia/express-mongoose-es6-rest-api](https://github.com/kunalkapadia/express-mongoose-es6-rest-api)

## Learn More

To learn more about Next.js and Express, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/en/starter/installing.html)
