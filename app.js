const express = require("express");
const app = express();
const path = require('path');
const port = 3004;
const { getContact, duplicateCheck, updateContact, deleteContact, addContact } 
      = require("./utility/contacts.js");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//memanggil database
const pool = require ('./db.js'); 

//req body
app.use(express.json());

//menggunakan ejs
app.set("view engine" , "ejs");

//express layouts
app.use(expressLayouts);
app.use(express.urlencoded());

//menggunaan cookieParser
app.use(cookieParser('secret'));
app.use(session ({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
})
);

app.use(flash());

//menggunakan express static
app.use(express.static(path.join(__dirname, 'public')))

//halaman utama
app.get ('/', (req,res) => {
    res.render('index',{
      layout :"layout/core-layout",
    });
});

//halaman about
app.get ('/about', (req,res) => {
  res.render('about', {
  layout :"layout/core-layout",
  });
});

// menuju halaman contact dengan menampilkan list contact pada table db
app.get("/contact", async (req, res) => {
  try {
    const contactList = await pool.query("SELECT * FROM kontak");
    const contacts = contactList.rows;

    res.render("contact", {
      title: "Page Contact",
      layout: "layout/core-layout",
      contacts,
      msg: req.flash("msg"),
    });
  } catch (err) {
    console.error(err.message);
    res.render("contact", {
      title: "Page Contact",
      layout: "layout/core-layout",
      contacts: [],
      msg: req.flash("msg"),
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
// Menghapus Kontak
app.get('/contact/delete/:nama', (req, res) => {
  // cek kontak di dalam file json berdasarkan nama
  const contact = fetchContact(req.params.nama);
  // jika contact tidak ada
  if (!contact) {
      res.status(404);
      res.send('Data Tidak Ada')
  } else {
      deleteContact(req.params.nama);
      req.flash('msg', 'Data Contact Deleted!')
      res.redirect('/contact');
  }
      
})

// mengubah data
app.get('/contact/update/:nama', (req, res) => {
  const contact = fetchContact(req.params.nama);

      res.render('updateContacts', {
      tittle: 'Form Update Data Contact',
      layout: 'layout/core-layout',
      contact,
  })
})

//proses update data
app.post('/contact/update', [
  body('nama').custom((value, {req}) => {    
      const duplicate = duplicateCheck(value);
      if (value !== req.body.oldNama && duplicate) {
          throw new Error('Nama Sudah Digunakan!'); 
      }
      return true;  
  }),
  check('email', 'Email Tidak Valid!!!').isEmail(), // validator email
  check('phone', 'Nomor Telp Tidak Valid!!!').isMobilePhone('id-ID') // validator no telp
], 

(req, res) => {
  const errors = validationResult(req);
  // mengirimkan error ke form
  if (!errors.isEmpty()) {        
      res.render('updateContacts', {
          tittle: 'Form Edit Data Contact',
          layout: 'layout/core-layout',
          errors: errors.array(),
          contact: req.body,
      });
  } else {
      updateContact(req.body)
      req.flash('msg', 'Update Berhasil !')
      res.redirect('/contact')
  }
})

//halaman detail kontak

app.get("/contact/:nama", async (req, res) => {
  const nama = req.params.nama;
  const contacts = await getContact();

  // Temukan objek contact berdasarkan nama
  const contact = contacts.find((contact) => contact.nama === nama);

  res.render("detail", {
    title: "Detail Contact",
    contact,
    isEmpty: true,
    layout: "layout/core-layout.ejs", 
  });
});

app.get("/addsync", async (req, res) => {
  try {
    const nama = "";
    const phone = "";
    const email = "";
    const newCont = await pool.query(
      `INSERT INTO kontak values ('${nama}', '${phone}', '${email}') RETURNING *`
    );
    res.json(newCont);
  } catch (err) {
    console.log(err.message)
  }
});

app.get("/list", async (req, res) => {
  try {
    const contact = await pool.query(`SELECT * FROM kontak`);
    res.json(contact.rows);
  } catch (err) {
    console.log(err.message);
  }
});


app.use('/',(req,res) => {
        res.status(404)
        res.send ('Page Not Found : 404 ')
})

app.listen(port,()=>{
    console.log(`Server Running at http://localhost:${port}`);
})