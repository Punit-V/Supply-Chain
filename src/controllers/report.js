
const db = require("../db/dbconfig")
const Shipment = db.shipments
const Inventory = db.inventory
const Order = db.order
const User = db.users
 
const shipmentReport = async (req, res) => {
 
    if (!req.user || req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Authenticate as Manager!' });
    }
 
    try {
        // Extract optional query parameters
        const { startDate, endDate, filterByStatus, groupBy } = req.query;
 
        // Build the where clause based on optional parameters
        const whereClause = {
            ...(startDate && endDate && { shipmentDate: { [Sequelize.Op.between]: [startDate, endDate] } }),
            ...(filterByStatus && { status: filterByStatus }),
        };
 
        // Query shipment details
        const shipmentDetails = await Shipment.findAll({
            where: whereClause,
            attributes: ['id', 'orderID', 'destination', 'shipmentDate', 'expectedDelivery', 'status'],
        });
 
        // Status analysis
        const statusAnalysis = await Shipment.count({
            where: whereClause,
            group: ['status'],
            attributes: ['status'],
        });
 
        // Delivery analysis
        const deliveryAnalysis = await Shipment.findOne({
            where: whereClause,
            attributes: [
                [Sequelize.fn('AVG', Sequelize.literal('DATEDIFF("expectedDelivery", "shipmentDate")')), 'averageDeliveryTime'],
                [
                    Sequelize.fn(
                        'SUM',
                        Sequelize.literal('CASE WHEN "status" = \'Delayed\' THEN 1 ELSE 0 END')
                    ),
                    'delayedCount',
                ],
                [Sequelize.fn('COUNT', '*'), 'totalCount'],
            ],
        });
 
        const delayedPercentage = (deliveryAnalysis.delayedCount / deliveryAnalysis.totalCount) * 100;
 
        // Geographical distribution (assuming a 'region' column in the Shipment model)
        const geographicalDistribution = await Shipment.findAll({
            where: whereClause,
            group: ['region'], // Change to the actual column name in your Shipment model
            attributes: ['region', [Sequelize.fn('COUNT', '*'), 'shipmentsCount']],
        });
 
        // Example response (replace with actual data)
        const reportResponse = {
            shipmentDetails,
            statusAnalysis,
            deliveryAnalysis: {
                averageDeliveryTime: deliveryAnalysis.averageDeliveryTime,
                delayedPercentage,
            },
            geographicalDistribution,
        };
 
        res.json(reportResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const inventoryReport = async (req, res) => {
    if (!req.user || req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Authenticate as Manager!' });
    }
 
    try {
        // Extract optional query parameters
        const { filterBy, sortBy, sortOrder } = req.query;
 
        // Define order and where clauses based on optional parameters
        const orderClause = sortBy ? [[sortBy, sortOrder || 'asc']] : [['id', 'asc']];
        const whereClause = filterBy
            ? {
                [Sequelize.Op.or]: [
                    { category: { [Sequelize.Op.like]: `%${filterBy}%` } },
                    { supplier: { [Sequelize.Op.like]: `%${filterBy}%` } },
                ],
            }
            : {};
 
        //  inventory details
        const inventoryDetails = await Inventory.findAll({
            where: whereClause,
            order: orderClause,
            attributes: ['id', 'itemName', 'quantity', 'price', 'supplier'],
        });
 
        // Inventory levels analysis
        const totalItems = await Inventory.sum('quantity');
        const lowStockItems = await Inventory.count({ where: { quantity: { [Sequelize.Op.lt]: 10 } } });
        const outOfStockItems = await Inventory.count({ where: { quantity: 0 } });
 
        // Turnover Rate
    const turnoverRates = [];

    for (const item of itemDetails) {
      const quantitySold = await Orders.sum('quantity', {
        where: { item_code: item.item_code },
      });

      const averageInventory = await Inventory.average('quantity', {
        where: { item_code: item.item_code },
      });

      const itemTurnoverRate = calculateTurnoverRate(quantitySold, averageInventory);

      turnoverRates.push({
        item_name: item.item_name,
        quantity_sold: quantitySold,
        average_inventory: averageInventory,
        turnover_rate: itemTurnoverRate,
      });
    }

    turnoverRates.sort((a, b) => b.turnover_rate - a.turnover_rate);
 
        // Financial summary
        const totalValue = await Inventory.sum(Sequelize.literal('"quantity" * "price"'));
        const averageCost = totalValue / totalItems;
 
        // Example response (replace with actual data)
        const reportOutcome = {
            inventoryDetails,
            inventorySummary: {
                totalItems,
                totalValue,
                averageCost,
                lowStockItems,
                outOfStockItems,
            },
            turnoverRates,
            financialSummary:{
                totalValue,
                averageCost
            }
        };
 
        res.json(reportOutcome);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
 
module.exports = {
    shipmentReport,
    inventoryReport
}

