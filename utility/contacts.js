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

// mencari Cari contact
const searchContact = (nama) => {
  const contacts = getContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

// perintah menuliskan file contacts.json dengan data baru
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// Menambahkan data contact baru json
const addContact = (contact) => {
  const contacts = getContact();
  contacts.push(contact);
  saveContacts(contacts);
};
// cek duplikat nama
const duplicateCheck = (nama) => {
  const contacts = getContact();
  return contacts.find((contact) => contact.nama === nama);
}

// delete contact
const deleteContact = (nama) => {
  const contacts = getContact();
  const filterContacts = contacts.filter(
      (contact) => contact.nama !== nama
  );
  saveContacts(filterContacts);
}

// update contact
const updateContact = (newContacts) => {
  const contacts = getContact();
  // menghilangkan data contact lama yang namanya sama dengan oldname
  const filterContacts = contacts.filter(
      (contact) => contact.nama !== newContacts.oldNama);
  delete newContacts.oldNama;
  filterContacts.push(newContacts);
  saveContacts(filterContacts);
}
module.exports = { getContact, addContact, updateContact, deleteContact, duplicateCheck };