export const iqroData = [
    {
        level: 1, 
        title: "Iqro 1", 
        description: "Mengenal huruf Hijaiyah tunggal dengan harakat Fathah (bunyi 'a'). Fokus pada pengenalan bentuk huruf dan pelafalan dasarnya.",
        cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_1.png",
        sections: [
            {
                title: "Halaman 1: Pengenalan Huruf Tunggal",
                info: "Fokus utama pada Jilid 1 adalah pengenalan huruf tunggal dengan harakat Fathah (bunyi \"a\") yang harus dibaca pendek dan cepat (satu ketukan).",
                items: [
                    { char: 'اَ', latin: 'A' }, { char: 'بَ', latin: 'Ba' }, { char: 'تَ', latin: 'Ta' }, { char: 'ثَ', latin: 'Tsa' },
                    { char: 'جَ', latin: 'Ja' }, { char: 'حَ', latin: 'Ha' }, { char: 'خَ', latin: 'Kho' }, { char: 'دَ', latin: 'Da' },
                    { char: 'ذَ', latin: 'Dza' }, { char: 'رَ', latin: 'Ro' }, { char: 'زَ', latin: 'Za' }, { char: 'سَ', latin: 'Sa' },
                    { char: 'شَ', latin: 'Sya' }, { char: 'صَ', latin: 'Sho' }, { char: 'ضَ', latin: 'Dho' }, { char: 'طَ', latin: 'Tho' },
                    { char: 'ظَ', latin: 'Zho' }, { char: 'عَ', latin: "'A" }, { char: 'غَ', latin: 'Gho' }, { char: 'فَ', latin: 'Fa' },
                    { char: 'قَ', latin: 'Qo' }, { char: 'كَ', latin: 'Ka' }, { char: 'لَ', latin: 'La' }, { char: 'مَ', latin: 'Ma' },
                    { char: 'نَ', latin: 'Na' }, { char: 'وَ', latin: 'Wa' }, { char: 'هَ', latin: 'Ha' }, { char: 'يَ', latin: 'Ya' }
                ],
                guide: "💡 Petunjuk Penting Pengajaran (Sesuai Pedoman Iqro):\n* Langsung (Sintetik): Tidak perlu mengeja (misal: \"Alif fathah A\"). Langsung dibaca A, Ba, Ta.\n* Pendek-Cepat: Bacaan tidak boleh dipanjangkan. Semua huruf di atas memiliki nilai satu harakat.\n* Ketelitian: Pastikan perbedaan bunyi antara huruf yang mirip (seperti Ha halus dan Ha besar, atau A dan 'A)."
            },
            {
                title: "Halaman 2: Latihan Kombinasi Huruf",
                info: "Latihan ini dirancang untuk melatih kelancaran dalam membedakan bunyi huruf saat digabungkan, dengan prinsip bacaan yang tetap pendek dan cepat (satu ketukan).",
                items: [
                    { char: 'اَ بَ', latin: 'A Ba' }, { char: 'بَ اَ', latin: 'Ba A' }, { char: 'بَ تَ', latin: 'Ba Ta' },
                    { char: 'اَ بَ تَ', latin: 'A Ba Ta' }, { char: 'تَ ثَ', latin: 'Ta Tsa' }, { char: 'اَ بَ تَ ثَ', latin: 'A Ba Ta Tsa' },
                    { char: 'اَ ثَ بَ', latin: 'A Tsa Ba' }, { char: 'تَ اَ ثَ', latin: 'Ta A Tsa' }, { char: 'جَ', latin: 'Ja' },
                    { char: 'اَ بَ تَ ثَ جَ', latin: 'A Ba Ta Tsa Ja' }, { char: 'حَ', latin: 'Ha' }, { char: 'جَ اَ حَ', latin: 'Ja A Ha' },
                    { char: 'خَ', latin: 'Kho' }, { char: 'حَ اَ خَ', latin: 'Ha A Kho' }, { char: 'اَ بَ تَ ثَ جَ حَ خَ', latin: 'A Ba Ta Tsa Ja Ha Kho' },
                    { char: 'دَ', latin: 'Da' }, { char: 'خَ اَ dَ', latin: 'Kho A Da' }, { char: 'ذَ', latin: 'Dza' }, { char: 'دَ اَ ذَ', latin: 'Da A Dza' }
                ],
                guide: "💡 Tips Menggunakan Tabel Ini:\n* Jangan Mengeja: Langsung baca bunyinya: A - Ba.\n* Kecepatan Konsisten: Ulangi hingga lancar.\n* Perhatikan Kemiripan Bunyi: Ta (تَ) vs Tsa (ثَ), Ha (حَ) vs Kho (خَ)."
            },
            {
                title: "Halaman 3: Pengenalan Huruf Tsa (ثَ)",
                info: "Santri diperkenalkan dengan huruf Tsa (ثَ) yang memiliki tiga titik di atasnya. Cara membacanya adalah dengan menyentuhkan ujung lidah ke ujung gigi seri atas sehingga terdengar lembut.",
                items: [
                    { char: 'تَ - ثَ', latin: 'Ta - Tsa' }, { char: 'ثَ اَ بَ', latin: 'Tsa A Ba' }, { char: 'تَ بَ ثَ', latin: 'Ta Ba Tsa' },
                    { char: 'اَ تَ ثَ', latin: 'A Ta Tsa' }, { char: 'ثَ بَ تَ', latin: 'Tsa Ba Ta' }, { char: 'اَ بَ ثَ', latin: 'A Ba Tsa' },
                    { char: 'ثَ تَ اَ', latin: 'Tsa Ta A' }, { char: 'بَ تَ ثَ', latin: 'Ba Ta Tsa' }, { char: 'ثَ اَ ثَ', latin: 'Tsa A Tsa' },
                    { char: 'بَ ثَ ثَ', latin: 'Ba Tsa Tsa' }, { char: 'اَ تَ بَ', latin: 'A Ta Ba' }, { char: 'ثَ ثَ اَ', latin: 'Tsa Tsa A' },
                    { char: 'اَ بَ تَ ثَ', latin: 'A Ba Ta Tsa' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 3):\n1. Teknis Suara: Pastikan bunyi Tsa (ثَ) berbeda dengan Sa (سَ).\n2. Visual Titik: Ajarkan santri untuk melihat jumlah titik (Ba=1 bawah, Ta=2 atas, Tsa=3 atas).\n3. Kemandirian: Biarkan santri mencoba membaca sendiri terlebih dahulu."
            },
            {
                title: "Halaman 4: Latihan Pengulangan",
                info: "Halaman ini bertujuan untuk memantapkan ingatan santri terhadap bentuk huruf dan perbedaan jumlah serta letak titik.",
                items: [
                    { char: 'اَ ثَ بَ', latin: 'A Tsa Ba' }, { char: 'تَ اَ ثَ', latin: 'Ta A Tsa' }, { char: 'بَ ثَ اَ', latin: 'Ba Tsa A' },
                    { char: 'تَ بَ ثَ', latin: 'Ta Ba Tsa' }, { char: 'اَ بَ تَ', latin: 'A Ba Ta' }, { char: 'تَ اَ بَ', latin: 'Ta A Ba' },
                    { char: 'ثَ اَ ثَ', latin: 'Tsa A Tsa' }, { char: 'بَ تَ ثَ', latin: 'Ba Ta Tsa' }, { char: 'اَ ثَ ثَ', latin: 'A Tsa Tsa' },
                    { char: 'تَ اَ تَ', latin: 'Ta A Ta' }, { char: 'اَ بَ تَ ثَ', latin: 'A Ba Ta Tsa' }
                ],
                guide: "💡 Petunjuk Pengajaran (Halaman 4):\n* Kecepatan: Pastikan santri membaca dengan pendek dan cepat.\n* Perbedaan Titik: Fokuskan perhatian santri pada letak dan jumlah titik.\n* Metode Langsung: Guru tidak perlu menjelaskan teori, cukup berikan contoh bunyi yang benar."
            },
            {
                title: "Halaman 5: Pengenalan Huruf Ja (جَ)",
                info: "Huruf ini memiliki titik di tengah (saat berdiri sendiri atau di awal kata) dan dibaca bersih tanpa ada desis atau serak.",
                items: [
                    { char: 'ثَ - جَ', latin: 'Tsa - Ja' }, { char: 'جَ اَ بَ', latin: 'Ja A Ba' }, { char: 'جَ ثَ تَ', latin: 'Ja Tsa Ta' },
                    { char: 'اَ تَ جَ', latin: 'A Ta Ja' }, { char: 'ثَ بَ جَ', latin: 'Tsa Ba Ja' }, { char: 'بَ جَ اَ', latin: 'Ba Ja A' },
                    { char: 'جَ اَ ثَ', latin: 'Ja A Tsa' }, { char: 'بَ تَ جَ', latin: 'Ba Ta Ja' }, { char: 'جَ ثَ ثَ', latin: 'Ja Tsa Tsa' },
                    { char: 'اَ بَ جَ', latin: 'A Ba Ja' }, { char: 'تَ ثَ جَ', latin: 'Ta Tsa Ja' }, { char: 'جَ اَ جَ', latin: 'Ja A Ja' },
                    { char: 'اَ بَ تَ ثَ جَ', latin: 'A Ba Ta Tsa Ja' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 5):\n* Makhraj Ja (جَ): Bunyi Jim berasal dari tengah lidah yang menyentuh langit-langit mulut bagian tengah.\n* Visualisasi Titik: Kenali perbedaan visual titik Ba (bawah) dan Ja (tengah).\n* Pendek-Cepat: Semua bacaan harus dibaca pendek (satu ketukan)."
            },
            {
                title: "Halaman 6: Pengenalan Huruf Kho (خَ)",
                info: "Huruf Kho (خَ) memiliki satu titik di atas. Cara membacanya adalah dengan mengeluarkan suara serak atau ngorok yang berasal dari tenggorokan bagian atas.",
                items: [
                    { char: 'جَ حَ خَ', latin: 'Ja Ha Kho' }, { char: 'حَ اَ خَ', latin: 'Ha A Kho' }, { char: 'خَ تَ جَ', latin: 'Kho Ta Ja' },
                    { char: 'بَ اَ خَ', latin: 'Ba A Kho' }, { char: 'تَ حَ ثَ', latin: 'Ta Ha Tsa' }, { char: 'جَ اَ خَ', latin: 'Ja A Kho' },
                    { char: 'خَ بَ ثَ', latin: 'Kho Ba Tsa' }, { char: 'حَ ثَ جَ', latin: 'Ha Tsa Ja' }, { char: 'اَ بَ خَ', latin: 'A Ba Kho' },
                    { char: 'تَ حَ جَ', latin: 'Ta Ha Ja' }, { char: 'اَ خَ خَ', latin: 'A Kho Kho' },
                    { char: 'اَ بَ تَ ثَ جَ حَ خَ', latin: 'A Ba Ta Tsa Ja Ha Kho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 6):\n* Perbedaan Visual: Tekankan perbedaan titik pada ج ح خ (di perut, tanpa titik, di atas).\n* Kualitas Bunyi Kho: Pastikan terdengar serak, tidak tertukar dengan Ha atau Ka."
            },
            {
                title: "Halaman 7: Pengenalan Huruf Da (دَ)",
                info: "Huruf Da (دَ) dibaca dengan ujung lidah menyentuh pangkal gigi seri atas. Dibaca pendek dan cepat (satu ketukan).",
                items: [
                    { char: 'خَ - دَ', latin: 'Kho - Da' }, { char: 'دَ اَ دَ', latin: 'Da A Da' }, { char: 'خَ دَ دَ', latin: 'Kho Da Da' },
                    { char: 'حَ بَ دَ', latin: 'Ha Ba Da' }, { char: 'جَ دَ اَ', latin: 'Ja Da A' }, { char: 'دَ بَ تَ', latin: 'Da Ba Ta' },
                    { char: 'حَ دَ ثَ', latin: 'Ha Da Tsa' }, { char: 'دَ خَ اَ', latin: 'Da Kho A' }, { char: 'حَ جَ دَ', latin: 'Ha Ja Da' },
                    { char: 'اَ بَ دَ', latin: 'A Ba Da' }, { char: 'تَ جَ دَ', latin: 'Ta Ja Da' },
                    { char: 'اَ بَ تَ ثَ جَ حَ خَ دَ', latin: 'A Ba Ta Tsa Ja Ha Kho Da' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 7):\n* Makhraj Da (دَ): Pastikan bunyi Da keluar dengan jelas dan mantap dari ujung lidah.\n* Tanpa Mengeja: Langsung membaca bunyinya tanpa mengeja 'Dal fathah Da'.\n* Pendek-Cepat: Semua bacaan dibaca pendek."
            },
            {
                title: "Halaman 8: Pengenalan Huruf Dza (ذَ)",
                info: "Huruf Dza (ذَ) memiliki satu titik di atas. Dibaca dengan menyentuhkan ujung lidah ke ujung gigi seri atas (bunyi lembut).",
                items: [
                    { char: 'دَ ذَ', latin: 'Da Dza' }, { char: 'دَ اَ ذَ', latin: 'Da A Dza' }, { char: 'خَ ذَ دَ', latin: 'Kho Dza Da' },
                    { char: 'اَ حَ ذَ', latin: 'A Ha Dza' }, { char: 'خَ تَ دَ', latin: 'Kho Ta Da' }, { char: 'جَ بَ ذَ', latin: 'Ja Ba Dza' },
                    { char: 'اَ بَ ذَ', latin: 'A Ba Dza' }, { char: 'جَ دَ خَ', latin: 'Ja Da Kho' }, { char: 'تَ ذَ اَ', latin: 'Ta Dza A' },
                    { char: 'خَ ذَ بَ', latin: 'Kho Dza Ba' }, { char: 'خَ حَ دَ', latin: 'Kho Ha Da' },
                    { char: 'اَ بَ تَ ثَ جَ حَ خَ دَ ذَ', latin: 'A Ba Ta Tsa Ja Ha Kho Da Dza' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 8):\n* Perbedaan Bunyi: Pastikan santri dapat membedakan antara Da (دَ) yang mantap dan Dza (ذَ) yang lembut.\n* Visual Titik: Ingatkan bahwa Dza memiliki satu titik di atasnya."
            },
            {
                title: "Halaman 9: Pengenalan Huruf Ro (رَ)",
                info: "Huruf Ro (رَ) dibaca dengan menggetarkan ujung lidah pada langit-langit depan. Pastikan bacaan tetap pendek dan cepat.",
                items: [
                    { char: 'ذَ - رَ', latin: 'Dza - Ro' }, { char: 'دَ ذَ رَ', latin: 'Da Dza Ro' }, { char: 'خَ ذَ رَ', latin: 'Kho Dza Ro' },
                    { char: 'رَ حَ دَ', latin: 'Ro Ha Da' }, { char: 'جَ رَ ذَ', latin: 'Ja Ro Dza' }, { char: 'رَ حَ ثَ', latin: 'Ro Ha Tsa' },
                    { char: 'تَ ذَ رَ', latin: 'Ta Dza Ro' }, { char: 'بَ رَ دَ', latin: 'Ba Ro Da' }, { char: 'خَ رَ جَ', latin: 'Kho Ro Ja' },
                    { char: 'حَ ذَ رَ', latin: 'Ha Dza Ro' }, { char: 'بَ رَ ثَ', latin: 'Ba Ro Tsa' }, { char: 'جَ حَ خَ', latin: 'Ja Ha Kho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 9):\n* Makhraj Ro (رَ): Pastikan lidah bergetar namun tidak berlebihan. Huruf Ro dengan fathah harus terdengar mantap/tebal.\n* Visual Bentuk: Ingatkan santri bahwa Ro (رَ) tidak memiliki titik."
            },
            {
                title: "Halaman 10: Pengenalan Huruf Za (زَ)",
                info: "Huruf Za (زَ) memiliki satu titik di atas. Dibaca dengan suara berdesis tajam seperti suara lebah.",
                items: [
                    { char: 'رَ زَ', latin: 'Ro Za' }, { char: 'رَ اَ زَ', latin: 'Ro A Za' }, { char: 'زَ دَ رَ', latin: 'Za Da Ro' },
                    { char: 'زَ خَ ذَ', latin: 'Za Kho Dza' }, { char: 'رَ حَ زَ', latin: 'Ro Ha Za' }, { char: 'خَ رَ جَ', latin: 'Kho Ro Ja' },
                    { char: 'تَ زَ دَ', latin: 'Ta Za Da' }, { char: 'بَ زَ رَ', latin: 'Ba Za Ro' }, { char: 'جَ اَ زَ', latin: 'Ja A Za' },
                    { char: 'ثَ بَ رَ', latin: 'Tsa Ba Ro' }, { char: 'حَ زَ دَ', latin: 'Ha Za Da' }, { char: 'دَ ذَ رَ زَ', latin: 'Da Dza Ro Za' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 10):\n* Makhraj Za (زَ): Pastikan bunyi desisnya tajam dan jelas.\n* Visual Titik: Bantu santri mengenali bahwa Ro dan Za bentuknya sama, namun Za memiliki satu titik di atasnya."
            },
            {
                title: "Halaman 11: Pengenalan Huruf Sa (سَ)",
                info: "Huruf Sa (سَ) dibaca dengan suara desis halus (seperti bunyi 'S' pada kata 'Satu').",
                items: [
                    { char: 'زَ - سَ', latin: 'Za - Sa' }, { char: 'سَ اَ سَ', latin: 'Sa A Sa' }, { char: 'زَ رَ سَ', latin: 'Za Ro Sa' },
                    { char: 'سَ خَ ذَ', latin: 'Sa Kho Dza' }, { char: 'حَ سَ دَ', latin: 'Ha Sa Da' }, { char: 'سَ خَ ثَ', latin: 'Sa Kho Tsa' },
                    { char: 'جَ زَ رَ', latin: 'Ja Za Ro' }, { char: 'سَ بَ تَ', latin: 'Sa Ba Ta' }, { char: 'ذَ رَ سَ', latin: 'Dza Ro Sa' },
                    { char: 'سَ زَ خَ', latin: 'Sa Za Kho' }, { char: 'رَ حَ زَ', latin: 'Ro Ha Za' },
                    { char: 'ثَ جَ حَ خَ دَ ذَ رَ زَ سَ', latin: 'Tsa Ja Ha Kho Da Dza Ro Za Sa' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 11):\n* Makhraj Sa (سَ): Bunyi keluar dari ujung lidah yang didekatkan ke gigi seri bawah, menghasilkan desis yang halus.\n* Perbedaan Sa dan Za: Tekankan perbedaan desis halus (Sa) dan desis tajam (Za)."
            },
            {
                title: "Halaman 12: Pengenalan Huruf Sya (شَ)",
                info: "Huruf Sya (شَ) memiliki bentuk yang sama dengan Sa (سَ) tetapi memiliki tiga titik di atasnya. Dibaca dengan menyebarkan udara di dalam mulut.",
                items: [
                    { char: 'سَ شَ', latin: 'Sa Sya' }, { char: 'سَ اَ شَ', latin: 'Sa A Sya' }, { char: 'سَ شَ شَ', latin: 'Sa Sya Sya' },
                    { char: 'زَ تَ شَ', latin: 'Za Ta Sya' }, { char: 'شَ ذَ تَ', latin: 'Sya Dza Ta' }, { char: 'دَ رَ سَ', latin: 'Da Ro Sa' },
                    { char: 'شَ تَ ذَ', latin: 'Sya Ta Dza' }, { char: 'زَ حَ ثَ', latin: 'Za Ha Tsa' }, { char: 'خَ شَ بَ', latin: 'Kho Sya Ba' },
                    { char: 'جَ رَ سَ', latin: 'Ja Ro Sa' }, { char: 'رَ شَ ذَ', latin: 'Ro Sya Dza' },
                    { char: 'ثَ جَ حَ خَ دَ ذَ رَ زَ سَ شَ', latin: 'Tsa Ja Ha Kho Da Dza Ro Za Sa Sya' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 12):\n* Makhraj Sya (شَ): Pastikan bunyi 'Sya' keluar dengan aliran udara yang menyebar luas di dalam mulut.\n* Perbedaan Titik: Ingatkan bahwa Sa tidak memiliki titik, sedangkan Sya memiliki tiga titik."
            },
            {
                title: "Halaman 13: Pengenalan Huruf Sho (صَ)",
                info: "Huruf Sho (صَ) dibaca dengan pangkal lidah yang diangkat ke langit-langit sehingga menghasilkan suara yang tebal dan kuat.",
                items: [
                    { char: 'شَ - صَ', latin: 'Sya - Sho' }, { char: 'صَ اَ شَ', latin: 'Sho A Sya' }, { char: 'صَ رَ صَ', latin: 'Sho Ro Sho' },
                    { char: 'سَ رَ صَ', latin: 'Sa Ro Sho' }, { char: 'صَ بَ رَ', latin: 'Sho Ba Ro' }, { char: 'دَ سَ صَ', latin: 'Da Sa Sho' },
                    { char: 'صَ ثَ رَ', latin: 'Sho Tsa Ro' }, { char: 'رَ صَ زَ', latin: 'Ro Sho Za' }, { char: 'ذَ صَ حَ', latin: 'Dza Sho Ha' },
                    { char: 'سَ خَ صَ', latin: 'Sa Kho Sho' }, { char: 'شَ بَ صَ', latin: 'Sya Ba Sho' },
                    { char: 'دَ ذَ رَ زَ سَ شَ صَ', latin: 'Da Dza Ro Za Sa Sya Sho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 13):\n* Makhraj Sho (صَ): Pastikan mulut sedikit mencucu atau pangkal lidah naik agar suara terdengar 'tebal' (Istila'), berbeda dengan Sa (سَ) yang tipis.\n* Visualisasi: Bantu santri mengenali bentuk kepala huruf Sho (صَ)."
            },
            {
                title: "Halaman 14: Pengenalan Huruf Dho (ضَ)",
                info: "Huruf Dho (ضَ) memiliki satu titik di atas. Dibaca dengan menempelkan sisi lidah ke gigi geraham atas sehingga menghasilkan suara yang tebal dan berat.",
                items: [
                    { char: 'صَ - ضَ', latin: 'Sho - Dho' }, { char: 'صَ اَ ضَ', latin: 'Sho A Dho' }, { char: 'حَ ضَ رَ', latin: 'Ha Dho Ro' },
                    { char: 'اَ ضَ رَ', latin: 'A Dho Ro' }, { char: 'شَ اَ ضَ', latin: 'Sya A Dho' }, { char: 'شَ خَ زَ', latin: 'Sya Kho Za' },
                    { char: 'ضَ رَ بَ', latin: 'Dho Ro Ba' }, { char: 'صَ حَ ثَ', latin: 'Sho Ha Tsa' }, { char: 'صَ دَ زَ', latin: 'Sho Da Za' },
                    { char: 'دَ شَ ضَ', latin: 'Da Sya Dho' }, { char: 'ضَ تَ ذَ', latin: 'Dho Ta Dza' },
                    { char: 'دَ ذَ رَ زَ سَ شَ صَ ضَ', latin: 'Da Dza Ro Za Sa Sya Sho Dho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 14):\n* Makhraj Dho (ضَ): Suara harus keluar dari samping lidah yang menyentuh geraham, bukan dari ujung lidah.\n* Ketebalan Suara: Pangkal lidah harus naik (Istila') agar suara terdengar penuh dan tebal."
            },
            {
                title: "Halaman 15: Pengenalan Huruf Tho (طَ)",
                info: "Huruf Tho (طَ) dibaca dengan ujung lidah ke pangkal gigi seri atas, namun dengan mengangkat pangkal lidah sehingga suaranya tebal dan kuat.",
                items: [
                    { char: 'طَ', latin: 'Tho' }, { char: 'طَ اَ ضَ', latin: 'Tho A Dho' }, { char: 'زَ طَ شَ', latin: 'Za Tho Sya' },
                    { char: 'حَ جَ طَ', latin: 'Ha Ja Tho' }, { char: 'تَ صَ ضَ', latin: 'Ta Sho Dho' }, { char: 'ذَ طَ سَ', latin: 'Dza Tho Sa' },
                    { char: 'زَ دَ طَ', latin: 'Za Da Tho' }, { char: 'ضَ صَ صَ', latin: 'Dho Sho Sho' }, { char: 'سَ رَ طَ', latin: 'Sa Ro Tho' },
                    { char: 'شَ خَ طَ', latin: 'Sya Kho Tho' }, { char: 'طَ حَ ذَ', latin: 'Tho Ha Dza' },
                    { char: 'دَ ذَ رَ زَ سَ شَ صَ ضَ طَ', latin: 'Da Dza Ro Za Sa Sya Sho Dho Tho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 15):\n* Makhraj Tho (طَ): Pastikan suara Tho terdengar jauh lebih kuat dan tebal daripada Ta (تَ).\n* Visualisasi: Bantu santri mengenali bentuk huruf Tho yang memiliki garis tegak."
            },
            {
                title: "Halaman 16: Pengenalan Huruf Zho (ظَ)",
                info: "Huruf Zho (ظَ) memiliki satu titik di atas. Dibaca dengan menyentuhkan ujung lidah ke ujung gigi seri atas namun dengan suara yang tebal.",
                items: [
                    { char: 'طَ - ظَ', latin: 'Tho - Zho' }, { char: 'ظَ اَ طَ', latin: 'Zho A Tho' }, { char: 'طَ حَ ظَ', latin: 'Tho Ha Zho' },
                    { char: 'ذَ - ظَ', latin: 'Dza - Zho' }, { char: 'سَ رَ ظَ', latin: 'Sa Ro Zho' }, { char: 'ضَ صَ ظَ', latin: 'Dho Sho Zho' },
                    { char: 'شَ اَ ظَ', latin: 'Sya A Zho' }, { char: 'زَ خَ طَ', latin: 'Za Kho Tho' }, { char: 'ثَ رَ ظَ', latin: 'Tsa Ro Zho' },
                    { char: 'تَ ضَ ظَ', latin: 'Ta Dho Zho' }, { char: 'شَ طَ ظَ', latin: 'Sya Tho Zho' },
                    { char: 'رَ زَ سَ شَ صَ ضَ طَ ظَ', latin: 'Ro Za Sa Sya Sho Dho Tho Zho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 16):\n* Makhraj Zho (ظَ): Ujung lidah menyentuh ujung gigi seri atas, suara tebal karena pangkal lidah terangkat.\n* Perbedaan Dza dan Zho: Bedakan bunyi Dza (ذَ) yang tipis dengan Zho (ظَ) yang sangat tebal."
            },
            {
                title: "Halaman 17: Pengenalan Huruf 'A (عَ)",
                info: "Huruf 'Ain (عَ) dibaca dengan tekanan di tengah tenggorokan. Pastikan bunyi ini bersih dan berbeda dengan Alif (A).",
                items: [
                    { char: 'عَ', latin: "'A" }, { char: 'ظَ اَ عَ', latin: 'Zho A \'A' }, { char: 'تَ عَ رَ', latin: 'Ta \'A Ro' },
                    { char: 'بَ عَ طَ', latin: 'Ba \'A Tho' }, { char: 'صَ عَ زَ', latin: 'Sho \'A Za' }, { char: 'صَ عَ ضَ', latin: 'Sho \'A Dho' },
                    { char: 'دَ حَ ظَ', latin: 'Da Ha Zho' }, { char: 'بَ عَ ثَ', latin: 'Ba \'A Tsa' }, { char: 'سَ عَ ظَ', latin: 'Sa \'A Zho' },
                    { char: 'ضَ عَ شَ', latin: 'Dho \'A Sya' }, { char: 'طَ عَ طَ', latin: 'Tho \'A Tho' },
                    { char: 'رَ زَ سَ شَ صَ ضَ طَ ظَ عَ', latin: 'Ro Za Sa Sya Sho Dho Tho Zho \'A' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 17):\n* Makhraj 'Ain (عَ): Tekankan bunyi dari tengah tenggorokan agar tidak terdengar seperti Alif (A).\n* Visualisasi: Kenali bentuk huruf 'Ain (عَ) yang kepalanya terbuka."
            },
            {
                title: "Halaman 18: Pengenalan Huruf Gho (غَ)",
                info: "Huruf Ghoin (غَ) memiliki satu titik di atas. Dibaca dengan suara dari tenggorokan bagian atas (seperti berkumur) dan dibaca tebal.",
                items: [
                    { char: 'عَ - غَ', latin: "'A - Gho" }, { char: 'غَ اَ عَ', latin: 'Gho A \'A' }, { char: 'دَ غَ ظَ', latin: 'Da Gho Zho' },
                    { char: 'عَ اَ غَ', latin: "'A A Gho" }, { char: 'ثَ عَ ظَ', latin: 'Tsa \'A Zho' }, { char: 'جَ غَ ظَ', latin: 'Ja Gho Zho' },
                    { char: 'سَ طَ عَ', latin: 'Sa Tho \'A' }, { char: 'شَ غَ طَ', latin: 'Sya Gho Tho' }, { char: 'صَ رَ عَ', latin: 'Sho Ro \'A' },
                    { char: 'تَ غَ ضَ', latin: 'Ta Gho Dho' }, { char: 'طَ عَ ظَ', latin: 'Tho \'A Zho' }, { char: 'طَ ظَ عَ غَ', latin: 'Tho Zho \'A Gho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 18):\n* Makhraj Gho (غَ): Pastikan bunyi Ghoin tidak tertukar dengan Kho. Ghoin lebih halus seperti suara air berkumur, sedangkan Kho lebih kering dan serak."
            },
            {
                title: "Halaman 19: Pengenalan Huruf Fa (فَ)",
                info: "Huruf Fa (فَ) dibaca dengan menempelkan ujung gigi seri atas ke bagian dalam bibir bawah.",
                items: [
                    { char: 'غَ - فَ', latin: 'Gho - Fa' }, { char: 'فَ اَ غَ', latin: 'Fa A Gho' }, { char: 'فَ رَ جَ', latin: 'Fa Ro Ja' },
                    { char: 'غَ اَ فَ', latin: 'Gho A Fa' }, { char: 'حَ صَ فَ', latin: 'Ha Sho Fa' }, { char: 'فَ ظَ لَ', latin: 'Fa Zho La' },
                    { char: 'شَ غَ فَ', latin: 'Sya Gho Fa' }, { char: 'عَ ذَ فَ', latin: '\'A Dza Fa' }, { char: 'فَ خَ ذَ', latin: 'Fa Kho Dza' },
                    { char: 'صَ رَ فَ', latin: 'Sho Ro Fa' }, { char: 'فَ عَ لَ', latin: 'Fa \'A La' },
                    { char: 'طَ ظَ عَ غَ فَ', latin: 'Tho Zho \'A Gho Fa' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 19):\n* Makhraj Fa (فَ): Pastikan suara keluar dengan aliran udara melalui celah gigi seri atas dan bibir bawah.\n* Langsung Bunyi: Langsung baca bunyinya 'Fa', jangan mengeja."
            },
            {
                title: "Halaman 20: Pengenalan Huruf Qo (قَ)",
                info: "Huruf Qof (قَ) dibaca dengan pangkal lidah menyentuh langit-langit lunak (belakang). Bunyinya mantap dan tebal.",
                items: [
                    { char: 'فَ - قَ', latin: 'Fa - Qo' }, { char: 'قَ بَ ضَ', latin: 'Qo Ba Dho' }, { char: 'قَ طَ فَ', latin: 'Qo Tho Fa' },
                    { char: 'فَ رَ قَ', latin: 'Fa Ro Qo' }, { char: 'ثَ غَ ظَ', latin: 'Tsa Gho Zho' }, { char: 'فَ قَ ظَ', latin: 'Fa Qo Zho' },
                    { char: 'سَ عَ فَ', latin: 'Sa \'A Fa' }, { char: 'قَ فَ صَ', latin: 'Qo Fa Sho' }, { char: 'عَ قَ دَ', latin: '\'A Qo Da' },
                    { char: 'ضَ غَ طَ', latin: 'Dho Gho Tho' }, { char: 'زَ قَ قَ', latin: 'Za Qo Qo' }, { char: 'فَ قَ', latin: 'Fa Qo' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 20):\n* Makhraj Qo (قَ): Pastikan suara Qof keluar dari pangkal lidah secara mantap (tebal).\n* Perbedaan Visual: Fa memiliki satu titik, sedangkan Qof memiliki dua titik."
            },
            {
                title: "Halaman 21: Pengenalan Huruf Ka (كَ)",
                info: "Huruf Kaf (كَ) dibaca dengan pangkal lidah ke langit-langit keras (lebih depan dari Qof). Bunyinya tipis dan disertai hembusan udara halus (hams).",
                items: [
                    { char: 'قَ - كَ', latin: 'Qo - Ka' }, { char: 'كَ حَ قَ', latin: 'Ka Ha Qo' }, { char: 'كَ قَ خَ', latin: 'Ka Qo Kho' },
                    { char: 'ضَ حَ كَ', latin: 'Dho Ha Ka' }, { char: 'عَ طَ فَ', latin: '\'A Tho Fa' }, { char: 'شَ كَ رَ', latin: 'Sya Ka Ro' },
                    { char: 'جَ كَ تَ', latin: 'Ja Ka Ta' }, { char: 'قَ لَ فَ', latin: 'Qo La Fa' }, { char: 'ذَ غَ سَ', latin: 'Dza Gho Sa' },
                    { char: 'عَ فَ كَ', latin: '\'A Fa Ka' }, { char: 'زَ كَ طَ', latin: 'Za Ka Tho' }, { char: 'فَ قَ كَ', latin: 'Fa Qo Ka' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 21):\n* Makhraj Ka (كَ): Pastikan suara Kaf terdengar tipis dan bersih, tidak seberat Qof.\n* Pendek-Cepat: Semua bacaan harus dibaca pendek (satu harakat)."
            },
            {
                title: "Halaman 22: Pengenalan Huruf La (لَ)",
                info: "Huruf Lam (لَ) dibaca dengan menyentuhkan ujung lidah ke langit-langit mulut bagian depan (di atas gusi).",
                items: [
                    { char: 'لَ', latin: 'La' }, { char: 'قَ لَ بَ', latin: 'Qo La Ba' }, { char: 'جَ عَ لَ', latin: 'Ja \'A La' },
                    { char: 'خَ لَ طَ', latin: 'Kho La Tho' }, { char: 'ذَ كَ رَ', latin: 'Dza Ka Ro' }, { char: 'غَ لَ ظَ', latin: 'Gho La Zho' },
                    { char: 'قَ فَ صَ', latin: 'Qo Fa Sho' }, { char: 'حَ لَ فَ', latin: 'Ha La Fa' }, { char: 'شَ كَ لَ', latin: 'Sya Ka La' },
                    { char: 'ضَ رَ عَ', latin: 'Dho Ro \'A' }, { char: 'كَ لَ لَ', latin: 'Ka La La' }, { char: 'فَ قَ كَ لَ', latin: 'Fa Qo Ka La' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 22):\n* Makhraj La (لَ): Bunyi Lam dihasilkan dengan lidah yang menyentuh langit-langit atas, pastikan bunyinya jelas dan ringan.\n* Tanpa Mengeja: Langsung baca 'La'."
            },
            {
                title: "Halaman 23: Pengenalan Huruf Ma (مَ)",
                info: "Huruf Mim (مَ) dibaca dengan cara merapatkan kedua bibir. Dibaca pendek dan cepat (satu ketukan).",
                items: [
                    { char: 'مَ', latin: 'Ma' }, { char: 'غَ مَ ضَ', latin: 'Gho Ma Dho' }, { char: 'لَ مَ سَ', latin: 'La Ma Sa' },
                    { char: 'جَ مَ عَ', latin: 'Ja Ma \'A' }, { char: 'فَ رَ ضَ', latin: 'Fa Ro Dho' }, { char: 'كَ رَ مَ', latin: 'Ka Ro Ma' },
                    { char: 'خَ لَ طَ', latin: 'Kho La Tho' }, { char: 'صَ مَ دَ', latin: 'Sho Ma Da' }, { char: 'ظَ اَ تَ', latin: 'Zho A Ta' },
                    { char: 'مَ رَ قَ', latin: 'Ma Ro Qo' }, { char: 'غَ مَ مَ', latin: 'Gho Ma Ma' },
                    { char: 'عَ غَ فَ قَ كَ لَ مَ', latin: '\'A Gho Fa Qo Ka La Ma' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 23):\n* Makhraj Ma (مَ): Pastikan bunyi Mim dihasilkan dengan merapatkan bibir secara sempurna.\n* Cara Belajar Santri Aktif (CBSA): Biarkan santri mencoba membaca sendiri secara mandiri."
            },
            {
                title: "Halaman 24: Pengenalan Huruf Na (نَ)",
                info: "Huruf Nun (نَ) dibaca dengan menyentuhkan ujung lidah ke langit-langit mulut bagian depan, sedikit di bawah makhraj huruf Lam.",
                items: [
                    { char: 'نَ', latin: 'Na' }, { char: 'نَ ظَ فَ', latin: 'Na Zho Fa' }, { char: 'نَ غَ شَ', latin: 'Na Gho Sya' },
                    { char: 'طَ عَ نَ', latin: 'Tho \'A Na' }, { char: 'صَ مَ ضَ', latin: 'Sho Ma Dho' }, { char: 'قَ رَ نَ', latin: 'Qo Ro Na' },
                    { char: 'خَ لَ قَ', latin: 'Kho La Qo' }, { char: 'زَ مَ نَ', latin: 'Za Ma Na' }, { char: 'كَ ذَ بَ', latin: 'Ka Dza Ba' },
                    { char: 'جَ نَ دَ', latin: 'Ja Na Da' }, { char: 'مَ نَ نَ', latin: 'Ma Na Na' },
                    { char: 'فَ قَ كَ لَ مَ نَ', latin: 'Fa Qo Ka La Ma Na' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 24):\n* Makhraj Na (نَ): Bunyi Nun dihasilkan dari ujung lidah, pastikan bunyinya jelas.\n* Visual Titik: Ingatkan santri bahwa Nun (نَ) memiliki satu titik di atas, berbeda dengan Ba (بَ)."
            },
            {
                title: "Halaman 25: Pengenalan Huruf Wa (وَ)",
                info: "Huruf Wawu (وَ) dibaca dengan membulatkan kedua bibir.",
                items: [
                    { char: 'نَ - وَ', latin: 'Na - Wa' }, { char: 'وَ زَ رَ', latin: 'Wa Za Ro' }, { char: 'وَ لَ غَ', latin: 'Wa La Gho' },
                    { char: 'دَ وَ مَ', latin: 'Da Wa Ma' }, { char: 'فَ طَ نَ', latin: 'Fa Tho Na' }, { char: 'قَ وَ مَ', latin: 'Qo Wa Ma' },
                    { char: 'ظَ جَ عَ', latin: 'Zho Ja \'A' }, { char: 'كَ وَ نَ', latin: 'Ka Wa Na' }, { char: 'سَ كَ تَ', latin: 'Sa Ka Ta' },
                    { char: 'خَ وَ صَ', latin: 'Kho Wa Sho' }, { char: 'وَ نَ وَ', latin: 'Wa Na Wa' },
                    { char: 'طَ ظَ عَ غَ فَ قَ كَ لَ مَ نَ وَ', latin: 'Tho Zho \'A Gho Fa Qo Ka La Ma Na Wa' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 25):\n* Makhraj Wa (وَ): Pastikan bibir mencucu (membulat) sempurna saat melafalkan bunyi Wa.\n* Evaluasi Rangkaian: Santri diharapkan sudah mulai lancar menyebutkan urutan huruf hingga Wawu."
            },
            {
                title: "Halaman 26: Pengenalan Huruf Ha (هَ)",
                info: "Huruf Ha (هَ) dibaca dengan suara yang keluar dari pangkal tenggorokan. Perhatikan perbedaannya dengan huruf Ha (حَ) halus.",
                items: [
                    { char: 'هَ', latin: 'Ha' }, { char: 'هَ مَ شَ', latin: 'Ha Ma Sya' }, { char: 'جَ هَ دَ', latin: 'Ja Ha Da' },
                    { char: 'دَ وَ هَ', latin: 'Da Wa Ha' }, { char: 'فَ خَ عَ', latin: 'Fa Kho \'A' }, { char: 'طَ هَ رَ', latin: 'Tho Ha Ro' },
                    { char: 'وَ ضَ حَ', latin: 'Wa Dho Ha' }, { char: 'وَ هَ ظَ', latin: 'Wa Ha Zho' }, { char: 'لَ مَ نَ', latin: 'La Ma Na' },
                    { char: 'زَ هَ قَ', latin: 'Za Ha Qo' }, { char: 'جَ هَ هَ', latin: 'Ja Ha Ha' },
                    { char: 'طَ ظَ عَ غَ فَ قَ كَ لَ مَ نَ وَ هَ', latin: 'Tho Zho \'A Gho Fa Qo Ka La Ma Na Wa Ha' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 26):\n* Makhraj Ha (هَ): Pastikan suara keluar dari pangkal tenggorokan (dada) sehingga terdengar berat dan berbeda dengan Ha (حَ) halus.\n* Kemandirian: Biarkan santri mencoba membaca sendiri secara aktif."
            },
            {
                title: "Halaman 27: Pengenalan Huruf Ya (يَ)",
                info: "Huruf Ya (يَ) adalah huruf terakhir dalam deretan huruf Hijaiyah. Dibaca dengan menaikkan tengah lidah ke langit-langit keras.",
                items: [
                    { char: 'يَ', latin: 'Ya' }, { char: 'ضَ يَا نَ', latin: 'Dho Ya Na' }, { char: 'سَ يَ غَ', latin: 'Sa Ya Gho' },
                    { char: 'طَ هَ ظَ', latin: 'Tho Ha Zho' }, { char: 'هَ يَ مَ', latin: 'Ha Ya Ma' }, { char: 'اَ بَ تَ ثَ', latin: 'A Ba Ta Tsa' },
                    { char: 'سَ شَ صَ ضَ', latin: 'Sa Sya Sho Dho' }, { char: 'ضَ حَ يَ', latin: 'Dho Ha Ya' }, { char: 'وَ كَ لَ', latin: 'Wa Ka La' },
                    { char: 'شَ يَ عَ', latin: 'Sya Ya \'A' }, { char: 'جَ ذَ ثَ', latin: 'Ja Dza Tsa' },
                    { char: 'مَ نَ وَ هَ يَ', latin: 'Ma Na Wa Ha Ya' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 27):\n* Makhraj Ya (يَ): Pastikan bunyi Ya keluar dengan jelas dari tengah lidah dan tidak tertukar dengan bunyi Alif (A).\n* Evaluasi Menyeluruh: Santri diharapkan sudah hafal huruf secara acak maupun berurutan."
            },
            {
                title: "Halaman 28: Latihan Kelancaran (1)",
                info: "Mulai melatih santri membaca kata-kata sederhana dengan tiga huruf hijaiyah tunggal yang dibaca secara pendek dan cepat.",
                items: [
                    { char: 'بَ رَ اَ', latin: 'Ba Ro A' }, { char: 'بَ رَ رَ', latin: 'Ba Ro Ro' }, { char: 'قَ رَ اَ', latin: 'Qo Ro A' },
                    { char: 'اَ مَ مَ', latin: 'A Ma Ma' }, { char: 'جَ نَ اَ', latin: 'Ja Na A' }, { char: 'سَ اَ لَ', latin: 'Sa A La' },
                    { char: 'رَ زَ قَ', latin: 'Ro Za Qo' }, { char: 'مَ دَ حَ', latin: 'Ma Da Ha' }, { char: 'غَ مَ مَ', latin: 'Gho Ma Ma' },
                    { char: 'لَ اَ كَ', latin: 'La A Ka' }, { char: 'مَ شَ اَ', latin: 'Ma Sya A' }, { char: 'حَ سَ نَ', latin: 'Ha Sa Na' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 28):\n* Kecepatan dan Ketepatan: Santri harus bisa membaca setiap baris dengan lancar tanpa terhenti.\n* Makhraj Huruf: Tetap perhatikan perbedaan makhraj, terutama A (اَ) dan 'A (عَ)."
            },
            {
                title: "Halaman 29: Latihan Kelancaran (2)",
                info: "Latihan pemantapan bagi santri untuk membaca kombinasi huruf-huruf tunggal dalam bentuk kata-kata pendek dengan harakat fathah.",
                items: [
                    { char: 'ثَ بَ تَ', latin: 'Tsa Ba Ta' }, { char: 'جَ حَ خَ', latin: 'Ja Ha Kho' }, { char: 'دَ ذَ رَ', latin: 'Da Dza Ro' },
                    { char: 'زَ سَ شَ', latin: 'Za Sa Sya' }, { char: 'اَ صَ ظَ', latin: 'A Sho Zho' }, { char: 'طَ ظَ عَ', latin: 'Tho Zho \'A' },
                    { char: 'غَ فَ قَ', latin: 'Gho Fa Qo' }, { char: 'كَ لَ مَ', latin: 'Ka La Ma' }, { char: 'نَ وَ هَ', latin: 'Na Wa Ha' },
                    { char: 'حَ هَ لَ', latin: 'Ha Ha La' }, { char: 'بَ يَ نَ', latin: 'Ba Ya Na' }, { char: 'اَ كَ لَ', latin: 'A Ka La' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 29):\n* Kecepatan: Santri dianggap lulus jika mampu membaca setiap baris dengan lancar.\n* Perbedaan Bunyi: Berikan perhatian khusus pada Ha (حَ) vs Ha (هَ), dan A (اَ) vs 'A (عَ)."
            },
            {
                title: "Halaman 30: Perhatian - Bedakan Bunyi",
                info: "Halaman ini sangat penting untuk melatih ketelitian dalam membedakan bunyi huruf-huruf yang memiliki makhraj atau sifat yang hampir mirip.",
                items: [
                    { char: 'اَ - عَ', latin: "A - 'A" }, { char: 'ثَ - سَ', latin: 'Tsa - Sa' }, { char: 'حَ - هَ', latin: 'Ha - Ha' },
                    { char: 'ثَ - شَ', latin: 'Tsa - Sya' }, { char: 'جَ - زَ', latin: 'Ja - Za' }, { char: 'سَ - شَ', latin: 'Sa - Sya' },
                    { char: 'ذَ - زَ', latin: 'Dza - Za' }, { char: 'سَ - صَ', latin: 'Sa - Sho' }, { char: 'خَ - غَ', latin: 'Kho - Gho' },
                    { char: 'تَ - طَ', latin: 'Ta - Tho' }, { char: 'كَ - قَ', latin: 'Ka - Qo' }, { char: 'ظَ - ضَ', latin: 'Zho - Dho' }
                ],
                guide: "💡 Petunjuk Pembelajaran (Halaman 30):\n* Kunci Kelulusan: Santri tidak diperkenankan lanjut jika masih sering tertukar dalam melafalkan pasangan huruf di atas.\n* Praktek Mandiri: Ulangi berkali-kali sampai perbedaannya terdengar nyata."
            },
            {
                title: "Halaman 31: Evaluasi Akhir",
                info: "Menentukan apakah santri sudah menguasai seluruh huruf Hijaiyah tunggal dan siap melanjutkan ke Jilid 2.",
                items: [
                    { char: 'اَ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ', latin: 'A Ba Ta Tsa Ja Ha Kho Da Dza Ro Za' },
                    { char: 'سَ شَ صَ ضَ طَ ظَ عَ غَ', latin: 'Sa Sya Sho Dho Tho Zho \'A Gho' },
                    { char: 'فَ قَ كَ لَ مَ نَ وَ هَ ء يَ', latin: 'Fa Qo Ka La Ma Na Wa Ha \'A Ya' },
                    { char: 'يَ ء هَ وَ نَ مَ لَ كَ قَ فَ', latin: 'Ya \'A Ha Wa Na Ma La Ka Qo Fa' },
                    { char: 'غَ عَ ظَ طَ ضَ صَ شَ سَ', latin: 'Gho \'A Zho Tho Dho Sho Sya Sa' },
                    { char: 'زَ رَ ذَ دَ خَ حَ جَ ثَ تَ بَ اَ', latin: 'Za Ro Dza Da Kho Ha Ja Tsa Ta Ba A' }
                ],
                guide: "💡 Kriteria Kelulusan Jilid 1:\n* Kelancaran: Mampu membaca seluruh huruf secara berurutan maupun acak tanpa terbata-bata.\n* Ketepatan Makhraj: Perbedaan bunyi antara huruf yang mirip harus konsisten dan benar.\n* Tanpa Mengeja dan Pendek-Cepat."
            }
        ]
    },
    { 
        level: 2, 
        title: "Iqro 2",
        description: "Mempelajari huruf yang disambung dan pengenalan bacaan panjang (Mad Thobi'i) yang dibaca sepanjang 2 harakat.",
        cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_2.png",
        sections: [ 
            { 
                title: "Coming Soon", 
                info: "Materi untuk Iqro 2 sedang dalam persiapan.",
                items: []
            }
        ]
    },
    { 
        level: 3, 
        title: "Iqro 3", 
        description: "Mengenal harakat Kasrah (bunyi 'i') dan Dhammah (bunyi 'u'), serta variasi bacaan panjang dan huruf sukun (mati).",
        cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_3.png",
        sections: [ 
            { 
                title: "Coming Soon", 
                info: "Materi untuk Iqro 3 sedang dalam persiapan.",
                items: []
            }
        ]
    },
    { 
        level: 4, 
        title: "Iqro 4", 
        description: "Mempelajari harakat Tanwin, hukum Nun Sukun/Tanwin, dan Qalqalah.",
        cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_4.png",
        sections: [ 
            { 
                title: "Coming Soon", 
                info: "Materi untuk Iqro 4 sedang dalam persiapan.",
                items: []
            }
        ]
    },
    { 
        level: 5, 
        title: "Iqro 5", 
        description: "Mengenal berbagai jenis Mad, bacaan Tasydid, dan cara berhenti (waqaf).",
        cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_5.png",
        sections: [ 
            { 
                title: "Coming Soon", 
                info: "Materi untuk Iqro 5 sedang dalam persiapan.",
                items: []
            }
        ]
    },
    { 
        level: 6, 
        title: "Iqro 6", 
        description: "Lanjutan hukum tajwid, waqaf, dan persiapan membaca Al-Quran.",
        cover: "https://github.com/Klik2/sumber/raw/38e9b8adc0c075bae9f5608492b4150c8ca193de/Iqra_6.png",
        sections: [ 
            { 
                title: "Coming Soon", 
                info: "Materi untuk Iqro 6 sedang dalam persiapan.",
                items: []
            }
        ]
    }
];