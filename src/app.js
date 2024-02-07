const express = require('express');
require('./db/dbconfig.js');



const app = express();  
const port = process.env.PORT;
app.use(express.json());



const userRouter = require("./routers/user")
const inventoryRouter = require("./routers/inventory")
const shipmentRouter = require("./routers/shipment")
const reportRouter = require("./routers/report")
const orderRouter = require("./routers/order")

app.use(userRouter)
app.use(inventoryRouter)
app.use(shipmentRouter)
app.use(reportRouter)
app.use(orderRouter)
 

app.get('', (req, res) => {
    res.send('check check checkkk')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
