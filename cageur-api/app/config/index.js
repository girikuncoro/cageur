module.exports = {
  // services
  postgresUrl: process.env.POSTGRES_URL || 'postgres://cageur_user:123456@localhost:5432/cageur_db',
  rabbitUrl: process.env.CLOUDAMQP_URL || 'amqp://localhost',
  port: parseInt(process.env.PORT) || 5000,
}
