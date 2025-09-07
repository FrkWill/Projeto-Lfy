const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// Função para testar conexão imediatamente
async function testConnection() {
  console.log('Tentando conectar ao banco com as configs:');
  console.log({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER
  });

  // Testa a conexão
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco bem-sucedida!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
  }
}

// Executa o teste só quando rodar esse arquivo diretamente
if (require.main === module) {
  testConnection();
}


module.exports = sequelize;
