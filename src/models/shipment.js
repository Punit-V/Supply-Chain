module.exports = (sequelize, DataTypes) => {
  const Shipments = sequelize.define("shipments", {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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


  return Shipments;
};
