const stage = process.env.NODE_ENV;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  // services
  postgresUrl: stage === 'test' ? 'postgres://cageur_user:123456@localhost:15432/cageur_db' : process.env.POSTGRES_URL || 'postgres://cageur_user:123456@localhost:5432/cageur_db',
  rabbitUrl: stage === 'test' ? 'amqp://localhost:15672' : process.env.CLOUDAMQP_URL || 'amqp://localhost',
  port: stage === 'test' ? 3000 : parseInt(process.env.PORT, 10) || 5000,

  // auth
  jwtSecret: process.env.JWT_SECRET || 'c49eu12',
  jwtSession: {
    session: true,
  },
  jwtExpiresIn: 10080, // in seconds

  // line api
  lineChannelID: process.env.LINE_CHANNEL_ID,
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET,
  lineChannelToken: process.env.LINE_CHANNEL_TOKEN,
};
