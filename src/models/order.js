module.exports = (sequelize, DataTypes) => {
    const Shipments = sequelize.define("shipments", {
      shipment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shipment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expected_delivery: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('In Transit', 'Delayed', 'Delivered'),
        allowNull: false,
      },
      current_location: {
        type: DataTypes.STRING,
        allowNull: true, // Adjust as needed
      },
    });
  
    Shipments.associate = (models) => {
      Shipments.belongsTo(models.Orders, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
      });
    };
  
    return Shipments;
  };
  