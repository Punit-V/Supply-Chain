
module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define("inventory", {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      supplier: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
    });
  
    return Inventory;
  };
  