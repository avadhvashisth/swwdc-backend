var env = process.env.NODE_ENV;
if (process.env.NODE_ENV != 'test') {
  var env = (process.env.PORT) ? 'production' : 'development';
}

console.log('env *****', env);

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
