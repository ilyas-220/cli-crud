const fs = require("fs/promises");
const { stdin, stdout } = require("process");
const readline = require("readline");

async function bacaData() {
  try {
    const data = await fs.readFile("data.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function simpanData(data) {
  await fs.writeFile("data.json", JSON.stringify(data, null, 2));
}

// create
async function addData(nama, umur) {
  const data = await bacaData();
  const newData = {
    id: Date.now(),
    nama,
    umur,
  };
  data.push(newData);
  await simpanData(data);
  console.log("☑️ data ditambahkan");
}

// read
async function readData() {
  const data = await bacaData();
  if (data.length === 0) {
    console.log("❌ data masih kosong");
    return;
  }
  data.forEach((d) => {
    console.log(`${d.id}, ${d.nama} - ${d.umur} tahun`);
  });
}

// delete

async function deleteData(id) {
  const data = await bacaData();
  const hasil = data.filter((d) => d.id !== id);
  if (data.length === hasil.length) {
    console.log("❌ ID tidak di temukan");
    return;
  }
  await simpanData(hasil);
  console.log("☑️ data dihapus");
}
// ======== CLI =========

const ri = readline.createInterface({
  input: stdin,
  output: stdout,
});

console.log(`
  ==== menu ====
  1. tambah data
  2. lihat data
  3. hapus data`);

ri.question("masukan menu :", async (menu) => {
  if (menu === "1") {
    ri.question("Nama : ", async (nama) => {
      ri.question("Umur : ", async (umur) => {
        await addData(nama, Number(umur));
        ri.close();
      });
    });
  }
  if (menu === "2") {
    await readData();
    ri.close();
  }

  if (menu === "3") {
    ri.question("masukan ID :", async (id) => {
      await deleteData(Number(id));
      ri.close();
    });
  }
});
