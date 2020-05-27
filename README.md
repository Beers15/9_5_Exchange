# TO RUN

mongoDB must be running

The MongoDB database for this applications is named 95ExchangeDB

* To test the various features of the application you will need to create both a buyer and a seller account 
  from the registration page.

* Only buyers can select 'purchase' which will only be shown if a buyer is logged in on each individual item page.
* Only sellers can post items from their dashboard.
* Sellers must re-enter the page to see a recently posted item under 'Listed Items'

in root folder, frontend, and backend:
```
npm i
```

then run the following in backend/api
```
node auth_service.js
node inventory_service.js
node reciept_service.js
node transaction_service.js

and run in backend
node gateway.js

alternatively run pm2 with all the services

run in root:
npm run dev-server
```

After starting the backend services, in second terminal in frontend dir. run:
```
npm start
```