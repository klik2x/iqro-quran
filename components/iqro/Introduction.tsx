import React from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

const Introduction: React.FC = () => {
    return (
        <details className="group bg-white dark:bg-dark-blue-card rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-emerald-dark dark:text-white p-5 hover:bg-gray-50 dark:hover:bg-dark-blue transition-colors">
                <span className="flex items-center gap-3">
                    <BookOpen />
                    Pendahuluan Belajar Iqro
                </span>
                <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 prose prose-sm dark:prose-invert max-w-none">
                <p>Membaca dan mempelajari Al-Qur'an adalah kewajiban bagi setiap umat muslim. Al-Qur'an merupakan kitab suci yang berisi firman-firman Allah untuk umat manusia, yang menjadi aturan dalam kehidupan.</p>
                <p>Untuk bisa membaca dan mengetahui isi Al-Qur'an tentu dibutuhkan kemampuan dan ketrampilan membaca. Karena itu mengajarkan membaca Al-Qur'an pada anak-anak sejak dini menjadi prioritas yang utama dalam pendidikan Islam.</p>
                <p>Terdapat beberapa metode yang biasannya digunakan untuk membaca Al-Qur'an. Belajar membaca Al-Qur'an bukan hanya sekedar mengenalkan huruf-huruf hijaiyah namun juga aspek lainnya sehingga Al-Qur'an dapat dibaca sebagaimana mestinya.</p>
                
                <h4>Penerapan Metode Pembelajaran</h4>
                <p>Penerapan Metode Pembelajaran Baca-Tulis Al-Qur'an diterangkan dalam materi pembelajaran baca Al-qur'an, secara umum dapat dikelompokkan ke dalam lima kelompok besar:</p>
                <ol>
                    <li>Pengenalan huruf hijaiyah dan makhrajnya.</li>
                    <li>Pemarkah (al-syakkal)</li>
                    <li>Huruf-huruf bersambung</li>
                    <li>Tajid dan bagianbagiannya</li>
                    <li>Gharaaib (bacaan bacaan yang tidak sama dengan kaidah secara umum).</li>
                </ol>

                <h4>Metode Iqro</h4>
                <p>Di Aplikasi Iqro Quran Digital menggunakan metode Iqro. Metode ini merupakan salah satu metode yang populer di Indonesia. Menggunakan panduan buku yang terdiri dari 6 jilid. Dilengkapi buku tajwid praktis dan dalam waktu relatif singkat. Metode ini dalam praktek pelaksanaannya tidak membutuhkan alat-alat yang bermacam-macam dan metode ini dapat ditekankan pada bacaan (mengeluarkan bacaan huruf atau suara huruf Al-qur'an) dengan fasih dan benar sesuai dengan makhrojnya dan bacaannya.</p>
                
                <h4>Panduan Lengkap Belajar Membaca Iqro 1 Sampai Iqro 6</h4>
                <p>Ini adalah panduan ringkas dan lengkap belajar Iqro 1 sampai Iqro 6, yang merupakan salah satu cara cepat belajar membaca Al-Qur’an dari nol untuk pemula.</p>

                <h5>Mengapa Metode Iqro Sangat Populer?</h5>
                <p>Belajar membaca Al-Qur’an adalah langkah awal untuk memahami kalamullah (firman Allah). Banyak metode cara cepat belajar Al-Qur’an yang tersedia, namun metode Iqro telah menjadi pilihan utama karena praktis, mudah dipahami, dan cocok untuk semua usia.</p>

                <h5>Apa Keistimewaan Metode Iqro?</h5>
                <ol>
                    <li><strong>Struktur Belajar yang Bertahap:</strong> Memudahkan pemula tanpa merasa kewalahan.</li>
                    <li><strong>Fokus pada Praktik Membaca:</strong> Lebih menekankan praktik langsung daripada hafalan teori.</li>
                    <li><strong>Cocok untuk Semua Usia:</strong> Dapat diterapkan untuk anak-anak hingga orang dewasa.</li>
                    <li><strong>Cepat dan Efisien:</strong> Memungkinkan seseorang mulai membaca Al-Qur’an hanya dalam beberapa bulan.</li>
                </ol>

                <h4>Panduan Belajar Iqro 1 Sampai Iqro 6</h4>
                
                <h5>IQRO 1: Mengenal Huruf Hijaiyah dengan Harakat Fathah</h5>
                <p>Langkah awal bagi pemula untuk belajar membaca Al-Qur’an. Anda akan mengenal 28 huruf hijaiyah dengan harakat fathah dan fokus pada pengucapan huruf yang benar secara makhraj.</p>
                
                <h5>IQRO 2: Membaca Huruf Hijaiyah Bersambung</h5>
                <p>Anda akan belajar membaca 2 dan 3 huruf hijaiyah yang dirangkai, serta melatih membaca tanda mad (panjang) pada huruf berharokat fathah.</p>

                <h5>IQRO 3: Mengenal Harakat Kasrah dan Dhammah</h5>
                <p>Mempelajari harakat kasrah (bunyi “i”) dan harakat dhammah (bunyi “u”), serta membiasakan membaca rangkaian huruf dengan tiga jenis harakat.</p>

                <h5>IQRO 4: Membaca Kombinasi Huruf Berharakat Tanwin</h5>
                <p>Mulai membaca huruf hijaiyah berharakat tanwin (fathatain, kasratain, dhammatain), mengenal tanda sukun, dan mengucapkan huruf-huruf qolqolah.</p>

                <h5>IQRO 5: Mengenal Idghom, Ikhfa, Tasydid</h5>
                <p>Mengenal hukum tajwid sederhana seperti Idghom, Ikhfa, Tasydid, dan tanda mad yang lebih panjang untuk membaca potongan ayat Al-Qur’an.</p>

                <h5>IQRO 6: Membaca Ayat Al-Qur’an dengan Lancar</h5>
                <p>Tahap akhir sebelum membaca mushaf Al-Qur’an, dengan membaca rangkaian ayat lengkap, tanda waqaf (berhenti), dan menguasai semua aturan dasar tajwid sederhana.</p>
                
                <h4>Tips Belajar Iqro dengan Cepat</h4>
                <ul>
                    <li><strong>Konsisten:</strong> Sediakan waktu khusus setiap hari.</li>
                    <li><strong>Fokus:</strong> Jauhkan semua faktor yang merusak fokus Anda.</li>
                    <li><strong>Gunakan Media Pendukung:</strong> Manfaatkan aplikasi ini, video tutorial, atau audio murottal.</li>
                    <li><strong>Bersabar dan Berdoa:</strong> Kesabaran adalah kunci, dan awali serta akhiri belajar dengan berdoa.</li>
                </ul>
            </div>
        </details>
    );
};

export default Introduction;