const auth = require('./auth');
const user = require('./user');
const monster = require('./monster');
const minion = require('./minion');

const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req, res) => {
        res.status(200).send({ message: "Welcome to the SERVER APIs"});
    });
    app.use('/api/auth', auth);
    app.use('/api/userA', authenticate, user);
    app.use('/api/minionA', authenticate, minion);
    app.use('/api/monsterA', authenticate, monster);


    app.use('/api/user', user);
    app.use('/api/minion', minion);
    app.use('/api/monster', monster);
};