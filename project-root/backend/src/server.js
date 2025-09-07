require('dotenv').config();

const { app, syncDB } = require('./app');
const authRoutes = require('./routes/auth');

// Rotas de autenticação (login e cadastro)
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;

syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ DB connection failed', err);
  process.exit(1);
});

