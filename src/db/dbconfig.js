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

// one to many b/w users and reports
db.users.hasMany(db.reports,{foreignKey:'userId'})
db.reports.belongsTo(db.users,{foreignKey:'userId'})
 

 
// one to one b/w orders and shipments
db.shipments.hasOne(db.order, { as: 'order', foreignKey: 'orderId' });
db.order.belongsTo(db.shipments, { as: 'shipment', foreignKey: 'orderId' });


db.sequelize.sync({ force: false }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db;
