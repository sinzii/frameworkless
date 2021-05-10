const dotenv = require('dotenv');
const dotenvPath = process.env.FWL_DOTENV_PATH || '.env';
const result = dotenv.config({ path: dotenvPath });

if (result.error) {
    throw Error('Please create an .env file in the root folder following the sample.env file\'s structure or set an environmental variable named FWL_DOTENV_PATH with your custom configuration file.')
}

const config = result.parsed;
Object.keys(config).forEach(name => {
    const value = config[name];

    if (!value) {
        return;
    }

    // remove the comment part after #
    if (value.includes('#')) {
        config[name] = value.split('#')[0].trim();
    }
});

config.ENV = config.NODE_ENV;

config.prod = config.ENV === 'production' || config.ENV === 'prod';
config.dev = !config.prod;

module.exports = config;


