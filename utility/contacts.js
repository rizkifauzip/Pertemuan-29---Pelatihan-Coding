const fs = require("fs");
const pool = require ('../db.js'); 

const lokasiDirr = "./data";
if (!fs.existsSync(lokasiDirr)) {
  fs.mkdirSync(lokasiDirr);
}
//code untuk membuat folder contacts
const dataPath = `./data/contacts.json`;

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}
// load kontak
const loadContact = () => {
  const file = fs.readFileSync(dataPath, `utf-8`);
  const contacts = JSON.parse(file);
  return contacts;
}

// mengambil data yang disimpan di db
const getContact = async () => {
  const connection = await pool.connect();
  const query = `SELECT * FROM kontak`;
  const results = await connection.query(query);
  const contacts = results.rows;
  return contacts;
};

//mencari kontak berdasarkan nama
const fetchContact = () => {
  //Membaca file JSON
  const file = fs.readFileSync(dataPath, "utf8");
  const contacts = JSON.parse(file);
  return contacts;
};

// mencari contact
const searchContact = async (nama) => {
  const contacts = await getContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

// perintah menuliskan file contacts.json dengan data baru
//const saveContacts = (contacts) => {
//fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
//};

// Menambahkan data contact baru json
const addContact = async (contact) => {
  const {nama, phone, email } = contact;
  const connection = await pool.connect();
  const query = ` INSERT INTO kontak (nama, phone, email)
    VALUES ($1, $2, $3)`;
  await connection.query(query, [nama, phone, email]);
};


// cek duplikat nama
const duplicateCheck = async (nama) => {
  const contacts = await getContact();
  return contacts.find((contact) => contact.nama === nama);
}

// delete contact
const deleteContact = async (nama) => {
  const connection = await pool.connect();
  const query = `DELETE FROM kontak
    WHERE nama = $1`;
  await connection.query(query, [nama]);
};

// update contact
  const updateContact = async (newContact) => {
    const connection = await pool.connect();
    const query = `
      UPDATE kontak SET nama = $1, phone = $2, email = $3
      WHERE nama = $4 RETURNING* ; `;

    await connection.query(query, [
      newContact.nama,
      newContact.phone,
      newContact.email,
      newContact.namaLama,
    ]);
  };

module.exports = { getContact, addContact, updateContact, deleteContact, duplicateCheck, searchContact };