![Framework Logo](/docs/images/frameworkless.png)
# Frameworkless
> A simple frameworkless NodeJS application

Inspired by a [tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework) about making a NodeJs application without framework on MDN.

![What I cannot create, I do not understand](/docs/images/feynman.png)
 
[Image source](https://github.com/danistefanovic/build-your-own-x)

## Features
- Updating...

## Stacks
- NodeJS v16
- MongoDB v4.4.4 (or PostgreSQL in the future)

## Setup development environment
### Using docker
- Install docker & docker-compose on your computer
- Run `npm install`
- Add the `.env` file for [configuration](#edit-the-env-file)
- Run `npm run docker-dev` the start the application
- Run `npm run docker-gulp-serve` if you edit any scss & typescript for frontend development

### No! I prefer the local environment
- Install NodeJS & MongoDB on your computer
- Run `npm install`
- Add the `.env` file for [configuration](#edit-the-env-file)
- Run `npm run dev` the start the application
- Run `npx gulp serve` if you edit any scss & typescript for frontend development

## Edit the .env file
We store all configuration in an `.env` file at the root folder of the application. 

You also can place the file anywhere you want but make sure to set env variable `FWL_DOTENV_PATH` to the file path. 

- `DB_TYPE`: mongo or postgre (not yet supported)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `SECURITY_SIGNING_SECRET`: A secret token for signing session id or jwt token  
- `HTTP_PORT`: Http port, default: 3000
- `HTTP_SESSION_MAX_AGE_IN_MINUTE`: Max age of a user session

## What are we working on?
The project is underdevelopment and if you're curious about what we're working on or want to know some of the future ideas will be implemented.
Take a look at our project development board at:
- [Github Board](https://github.com/sinzii/frameworkless/projects/1)
- [Notion Notes](https://www.notion.so/iiznis/Frameworkless-b6f7424f10d54eee9efe94aa014a10ad)

If you've got any interesting ideas or spot any problems in the project, let's discuss it [here](https://github.com/sinzii/frameworkless/issues)! 

## Contributing
We embrace all the contributions to our heart, so don't hesitate to shoot a pull request.

1. [Fork it](https://github.com/sinzii/frameworkless/fork)
2. Create your feature branch (`git checkout -b feature/featureX`)
3. Commit your changes (`git commit -am 'Add some description'`)
4. Push to the branch (`git push origin feature/featureX`)
5. Create a new Pull Request

## License
[MIT](LICENSE)

<!-- URLs -->
