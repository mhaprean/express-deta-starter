

### simple rest api starter with express, ts, and DETA.SH

- get started: 

* create an account on https://www.deta.sh/ 
* from your dashboard go to Project Keys and create a new Key
* create an .env file simmilar to .env.local and update  your DETA credentials there


#### features: 

* register ( /api/auth/register )
* login ( /api/auth/login )
* visit private page ( /api/auth/profile)

* upload images to DETA DRIVE. the file key should be "image"  ( /api/upload ). 
* read the uploaded images ( /api/images/:imagename )