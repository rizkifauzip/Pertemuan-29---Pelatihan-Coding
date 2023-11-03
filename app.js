const express = require("express");
const app = express();
const port = 3004;

app.set("view engine" , "ejs");

app.get ('/', (req,res) => {
    res.render('index')
});
app.get ('/about', (req,res) => {
  res.render('about',{nama:"rizki fauzi"})
});

app.get ('/contact', (req,res) => {
    const contact = [
        //{nama : "RIZKI FAUZI P", phone : "088822222"},
       // {nama : "FAUZI PERMANA", phone : "08888222222"},
    ]
    if (contact.length === 0) {
        // Menampilkan pemberitahuan jika objek contacts yang kosong
        res.render("contact", {
          contact,
          isEmpty: true, 
        });
      } else {
        res.render("contact", {
          contact,
          isEmpty: false, 
        });
      }
});

app.use('/',(req,res) => {
        res.status(404)
        res.send ('Page Not Found : 404 ')
})

app.listen(port,()=>{
    console.log(`Server Running at http://localhost:${port}`);
})