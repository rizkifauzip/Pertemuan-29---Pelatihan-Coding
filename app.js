const express = require("express");
const app = express();
const path = require('path');
const port = 3004;
const { fetchContact, searchContact, addContact, duplicateCheck } = require("./utility/contacts.js");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult } = require("express-validator");

//menggunakan ejs
app.set("view engine" , "ejs");

//express layouts
app.use(expressLayouts);
app.use(express.urlencoded());

//menggunakan express static
app.use(express.static(path.join(__dirname, 'public')))

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
  const contact = fetchContact();
    //const contact = [
       // {nama : "RIZKI FAUZI P", phone : "088822222"},
        //{nama : "FAUZI PERMANA", phone : "08888222222"},
    //]
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
//menambahkan data
app.get("/contact/add", (req, res) => {
  res.render("addContact", {
    title: "Add Contact",
    layout: "layout/core-layout.ejs",
  });
});

//memvalidasi "nama" yang sama
app.post("/contact",
  [
    body("nama").custom((value) => {
      const duplicate = duplicateCheck(value);
      if (duplicate) {
        throw new Error("Gunakan nama yang lain, nama sudah terdaftar");
      }
      return true;
    }),
  ],

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("addContact", {
        title: "addContact",
        layout: "layout/core-layout.ejs",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:nama", (req, res) => {
  const contact = searchContact(req.params.nama);

  res.render("detail", {
    title: "Detail Contact",
    contact,
    isEmpty: true,
    layout: "layout/core-layout.ejs", 
  });
});

app.use('/',(req,res) => {
        res.status(404)
        res.send ('Page Not Found : 404 ')
})

app.listen(port,()=>{
    console.log(`Server Running at http://localhost:${port}`);
})