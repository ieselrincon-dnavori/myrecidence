

const express = require('express');
const app = express();
const cors = require('cors');


var corsOptions = {
    origin: "http://localhost:8100"
};  

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./models/index.js');


db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Db');
});



//ENDPOINTS
app.get('/', (req, res) => {
    res.send('Hello World!');
});

require('./routes/user.recidence.routes.js')(app);


//FIN ENDPOINTS


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});