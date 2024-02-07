module.exports = (sequelize, DataTypes) => {
    const Reports = sequelize.define("reports", {
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      report_type: {
        type: DataTypes.ENUM('Inventory', 'Shipment'),
        allowNull: false,
      },
      generated_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      report_data: {
        type: DataTypes.JSON,
        allowNull: false,
      }
    });
  
   
    return Reports;
  };
  



  