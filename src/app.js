const express = require('express');
require('./db/dbconfig.js');
require('./notification/notification.js')

const librarianRouter = require('./routers/librarian.js');
const userRouter = require('./routers/user.js');
const bookRouter = require('./routers/book.js');


const app = express();  
const port = process.env.PORT;
app.use(express.json());

//Routers
app.use( librarianRouter);
app.use( userRouter);
app.use( bookRouter);




app.get('', (req, res) => {
    res.send('check check checkkk')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
