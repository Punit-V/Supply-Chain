module.exports = (sequelize, DataTypes) => {
    const Reports = sequelize.define("reports", {
      
      report_type: {
        type: DataTypes.ENUM('Inventory', 'Shipment'),
        allowNull: false,
      },
      generated_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
   
    return Reports;
  };
  



  