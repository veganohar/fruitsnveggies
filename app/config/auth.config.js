const url = "http://127.0.0.1:3000"
module.exports = {
  secret: "Fruirs&Vegetables-secret-key",
  mailTransporter:{
    port: 465,              
    host: "smtp.gmail.com",
       auth: {
            user: 'imadlwxn79@gmail.com',
            pass: 'Imad1234',
         },
    },
    url:url
};