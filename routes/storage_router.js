'use strict';
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
// const jwToken = require(__dirname + '/../lib/jtoken_auth');
const multer  = require('multer');
const upload = multer();
const B2 = require('backblaze-b2');
const b2 = new B2({
    accountId: process.env['BACKBLAZE_ACCOUNT_ID'],
    applicationKey: process.env['BACKBLAZE_APPLICATION_KEY']
});

const storageRouter = module.exports = exports = Router();

storageRouter.get('/', (req, res) => {
  res.json({msg: 'Storage Api'})
})

storageRouter.post('/upload', /*jwToken,*/ upload.single('file'), (req, res) => {
  b2.authorize().then((auth)=>{
    b2.getUploadUrl(process.env['BACKBLAZE_BUCKET_ID']).then((data)=> {
      b2.uploadFile({
        uploadUrl: data.uploadUrl,
        uploadAuthToken: data.authorizationToken,
        filename: req.body.name,
        // mime: '', // optonal mime type, will default to 'b2/x-auto' if not provided
        data: req.file.buffer, // this is expecting a Buffer not an encoded string,
        // info: { 
        //     // optional info headers, prepended with X-Bz-Info- when sent, throws error if more than 10 keys set
        //     // valid characters should be a-z, A-Z and '-', all other characters will cause an error to be thrown
        //     // key1: value,
        //     // key2: value
        // }
      }).then((data)=>{
        res.send(data)
      })
    })
  })
});

storageRouter.get('/allmedia', /*jwToken,*/ (req, res) => {
  b2.authorize().then((auth)=>{
    b2.listFileVersions({
        bucketId: process.env['BACKBLAZE_BUCKET_ID'],
        maxFileCount: 100
    }).then((allmedia)=>{
      res.json(allmedia.files.map((file)=>{return { id: file.fileId, fileName: file.fileName, uploadTimestamp: file.uploadTimestamp}}));
    });
  })  
})

storageRouter.get('/file/:id', /*jwToken,*/ (req, res) => {
  b2.downloadFileById(req.params.id).then((file)=>{
        res.send(file)
  });
})

