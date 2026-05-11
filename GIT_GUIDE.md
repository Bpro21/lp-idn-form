# Panduan Git untuk Project ads2.idn.id
*(Terakhir diperbarui: 8 Mei 2026, 13:54 WIB)*

Dokumen ini berisi panduan dasar untuk melakukan `pull` dan `push` code ke repository GitHub.

## 1. Persiapan Awal (Sisi GitHub)
Sebelum bisa melakukan push/pull, pastikan Anda memiliki **Personal Access Token (PAT)** karena GitHub sudah tidak mendukung password biasa untuk HTTPS.

*   Buka GitHub **Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
*   Klik **Generate new token**.
*   Beri nama (misal: "Akses Laptop") dan centang scope `repo`.
*   **Simpan Token** tersebut di tempat aman. Token ini yang akan digunakan sebagai "password" saat diminta oleh Git.

## 2. Cara Mengambil Code Terbaru (Pull)
Gunakan perintah ini untuk mengambil perubahan terbaru dari GitHub ke folder lokal:

```bash
git pull origin master
```
*(Branch utama repository ini adalah `master`)*

## 3. Cara Mengirim Perubahan (Push)
Ikuti langkah-langkah ini jika Anda telah melakukan perubahan pada file di folder ini:

1.  **Cek status perubahan:**
    ```bash
    git status
    ```
2.  **Tambahkan file yang diubah ke area persiapan (staging):**
    ```bash
    git add .
    ```
3.  **Simpan perubahan dengan pesan (commit):**
    ```bash
    git commit -m "Deskripsi perubahan kamu di sini"
    ```
4.  **Kirim ke GitHub:**
    ```bash
    git push origin master
    ```

## 4. Tips Agar Tidak Terus Memasukkan Password/Token
Agar Git mengingat token Anda, jalankan perintah ini sekali saja:

```bash
git config --global credential.helper store
```
Setelah ini, saat pertama kali Anda push/pull, masukkan username GitHub dan Token PAT Anda. Git akan menyimpannya untuk selanjutnya.
