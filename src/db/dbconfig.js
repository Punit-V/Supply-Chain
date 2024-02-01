const { Sequelize , DataTypes} = require('sequelize');
const sequelize = new Sequelize(
    {
        
    "username": process.env.DB_USER,

    "password": null,

    "database": process.env.DB_NAME,

    "host": process.env.DB_HOST,

    "dialect": "mysql",

    "logging":false

    }
);

sequelize.authenticate().then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log('error ' + err)
});

const db= {};
db.Sequelize = Sequelize;   
db.sequelize = sequelize;


db.librarians = require('../models/librarian.js')(sequelize, DataTypes)
db.users = require('../models/user.js')(sequelize, DataTypes)
db.books = require('../models/book.js')(sequelize, DataTypes)
db.transactions  = require('../models/transaction.js')(sequelize, DataTypes)


// many to many between users and books
db.users.belongsToMany(db.books , { through : db.transactions, foreignKey : 'userId', onDelete: 'CASCADE'})
db.books.belongsToMany(db.users , { through : db.transactions, foreignKey : 'bookId', onDelete: 'CASCADE'})


db.transactions.belongsTo(db.books, { foreignKey: 'bookId' });
db.transactions.belongsTo(db.users, { foreignKey: 'userId' });


db.sequelize.sync({ force: false }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db;
