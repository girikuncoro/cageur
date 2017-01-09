if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  // services
  postgresUrl: process.env.POSTGRES_URL || 'postgres://cageur_user:123456@localhost:5432/cageur_db',
  rabbitUrl: process.env.CLOUDAMQP_URL || 'amqp://localhost',
  port: parseInt(process.env.PORT) || 5000,

  // line api
  lineChannelID: process.env.LINE_CHANNEL_ID,
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET,
  lineChannelToken: process.env.LINE_CHANNEL_TOKEN,
}
