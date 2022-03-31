Based on following tutorial: 
https://www.digitalocean.com/community/tutorials/nodejs-intro-stripe-payments
To set up NodeJS EC2 server, use following tutoral: 
https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server

Required Dependencies: 
- express
- ejs
- stripe

Notes for EC2 Hosting: 
- Create security group inbound rule as following: 
  - CUSTOM TCP
  - Port 3000
  - 0.0.0.0/0 (IPv4)
  - ::/0 (IPv6)
- By default, server WILL NOT run if terminal window (Putty) is closed
  - Perform following in terminal to enable service: 
    - npm install pm2 -g
    - pm2 start app.js
      - this command forces server to run even if terminal is closer
    - pm2 startup
      - pm2 runs automatically on instance startup
