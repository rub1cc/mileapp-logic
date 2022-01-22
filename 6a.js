// terdapat 2 variabel A & B
// A = 3
// B = 5

// Tukar Nilai variabel A dan B, Syarat Tidak boleh menambah Variabel Baru

// Hasil yang diharapkan :
//A = 5
//B = 3

// answer
let A = 3;
let B = 5;

[A, B] = [B,A];

console.log(`A = ${A}`)
console.log(`B = ${B}`)