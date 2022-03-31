const env = process.env;

const config = {
  db: { /* do not put password or any sensitive info here, done only for demo */
    // host: env.DB_HOST || 'queenie.db.elephantsql.com',
    // port: env.DB_PORT || '5432',
    // user: env.DB_USER || 'USERNAME',
    // password: env.DB_PASSWORD || 'PASSWORD',
    // database: env.DB_NAME || 'USERNAME',
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
