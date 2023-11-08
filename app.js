const express = require("express");
const app = express();
const port = 3004;
const expressLayouts = require("express-ejs-layouts");


app.set("view engine" , "ejs");

//express layouts
app.use(expressLayouts);

app.get ('/', (req,res) => {
    res.render('index',{
      layout :"layout/core-layout",
    });
});
app.get ('/about', (req,res) => {
  res.render('about', {
  layout :"layout/core-layout",
  });
});

app.get ('/contact', (req,res) => {
    const contact = [
        {nama : "RIZKI FAUZI P", phone : "088822222"},
        {nama : "FAUZI PERMANA", phone : "08888222222"},
    ]
    if (contact.length === 0) {
        // Menampilkan pemberitahuan jika objek contacts yang kosong
        res.render("contact", {
          contact,
          isEmpty: true, 
          layout :"layout/core-layout",
        });
      } else {
        res.render("contact", {
          contact,
          isEmpty: false, 
          layout :"layout/core-layout",
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