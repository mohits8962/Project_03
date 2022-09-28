const express = require('express')
const router = express.Router()
const aws = require("aws-sdk")

const userController = require('../Controllers/userController')
const bookController = require("../Controllers/bookController")
const reviewController = require('../Controllers/reviewController')
const mid1 = require('../Middleware/auth')

//users API
router.post('/register', userController.createUser)
router.post('/login', userController.uesrLogin)

//Books API
router.post("/books", mid1.authentication, bookController.createBook)
router.get("/books", mid1.authentication, bookController.getbooks)
router.get("/books/:bookId", mid1.authentication, bookController.getBookByParams)
router.put("/books/:bookId", mid1.authentication, bookController.updateBook)
router.delete("/books/:bookId", mid1.authentication, bookController.deleteBook)

//Reviews API
router.post('/books/:bookId/review', reviewController.createReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

//Validation for worng route=============================>

// router.all('/*/', async function (req, res) {
//     return res.status(404).send({ status: false, message: "Page Not Found" })
// })

////////////////////////////////////

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})


let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "32/" + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

    })
}


router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})

module.exports = router
