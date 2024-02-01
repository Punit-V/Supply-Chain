module.exports = (sequelize, DataTypes) => {
    const Reports = sequelize.define("reports", {
      report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_type: {
        type: DataTypes.ENUM('Inventory', 'Shipment'),
        allowNull: false,
      },
      generated_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    Reports.associate = (models) => {
      Reports.belongsTo(models.Users, {
        foreignKey: 'generated_by',
        onDelete: 'CASCADE',
      });
    };
  
    return Reports;
  };
  