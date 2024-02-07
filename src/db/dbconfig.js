const { Sequelize , DataTypes} = require('sequelize');
const sequelize = new Sequelize(
    {
        
    "username": process.env.DB_USER,

    "password": "",

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

db.users = require('../models/user.js')(sequelize, DataTypes)
db.inventory = require('../models/inventory.js')(sequelize, DataTypes)
db.orders = require('../models/order.js')(sequelize, DataTypes)
db.shipments  = require('../models/shipment.js')(sequelize, DataTypes)
db.reports  = require('../models/report.js')(sequelize, DataTypes)


// one to many b/w users and reports
db.users.hasMany(db.reports,{foreignKey:'userId'})
db.reports.belongsTo(db.users,{foreignKey:'userId'})
 
// one to one b/w orders and shipments
db.shipments.hasOne(db.orders, { as: 'Orders', foreignKey: 'orderId' });
db.orders.belongsTo(db.shipments, { as: 'Shipments', foreignKey: 'orderId' });


db.sequelize.sync({ force: false }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db;
