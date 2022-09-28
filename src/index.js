const express = require('express');
const route = require('./routes/route');
const mongoose= require('mongoose');
const app = express();

const multer= require("multer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( multer().any())

mongoose.connect("mongodb+srv://mohits8962:m26u72h8@group-32-database.f1gfhiv.mongodb.net/group-32?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
