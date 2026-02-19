
import React from 'react';
import { HijaiyahLetter, Doa } from './types';

export const HIJAIYAH_LETTERS: HijaiyahLetter[] = [
  { letter: 'ا', name: 'Alif', sound: 'Alif' },
  { letter: 'ب', name: 'Ba', sound: 'Ba' },
  { letter: 'ت', name: 'Ta', sound: 'Ta' },
  { letter: 'ث', name: 'Tsa', sound: 'Tsa' },
  { letter: 'ج', name: 'Jim', sound: 'Jim' },
  { letter: 'ح', name: 'Ha', sound: 'Ha' },
  { letter: 'خ', name: 'Kho', sound: 'Kho' },
  { letter: 'د', name: 'Dal', sound: 'Dal' },
  { letter: 'ذ', name: 'Dzal', sound: 'Dzal' },
  { letter: 'ر', name: 'Ro', sound: 'Ro' },
  { letter: 'ز', name: 'Zay', sound: 'Zay' },
  { letter: 'س', name: 'Sin', sound: 'Sin' },
  { letter: 'ش', name: 'Syin', sound: 'Syin' },
  { letter: 'ص', name: 'Shod', sound: 'Shod' },
  { letter: 'ض', name: 'Dhod', sound: 'Dhod' },
  { letter: 'ط', name: 'Tho', sound: 'Tho' },
  { letter: 'ظ', name: 'Zho', sound: 'Zho' },
  { letter: 'ع', name: 'Ain', sound: 'Ain' },
  { letter: 'غ', name: 'Gho', sound: 'Gho' },
  { letter: 'ف', name: 'Fa', sound: 'Fa' },
  { letter: 'ق', name: 'Qof', sound: 'Qof' },
  { letter: 'ك', name: 'Kaf', sound: 'Kaf' },
  { letter: 'ل', name: 'Lam', sound: 'Lam' },
  { letter: 'م', name: 'Mim', sound: 'Mim' },
  { letter: 'ن', name: 'Nun', sound: 'Nun' },
  { letter: 'و', name: 'Wau', sound: 'Wau' },
  { letter: 'ه', name: 'Ha', sound: 'Ha' },
  { letter: 'ي', name: 'Ya', sound: 'Ya' },
];

export const DOA_LIST: Doa[] = [
    {
        id: '1',
        title: 'Doa Diterima Amal Ibadah (Nabi Ibrahim & Ismail عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
        latin: "Rabbana taqabbal minna innaka antas-sami'ul-'alim.",
        translation: 'Ya Tuhan kami, terimalah (amal) dari kami. Sungguh, Engkaulah Yang Maha Mendengar, Maha Mengetahui.',
        source: 'QS. Al-Baqarah: 127',
        ayahNumber: 134
    },
    {
        id: '2',
        title: 'Doa Menjadi Muslim Taat & Mohon Taubat',
        arabic: 'رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
        latin: "Rabbana waj'alna muslimaini laka wa min zurriyyatina ummatam muslimatal laka wa arina manasikana wa tub 'alaina innaka antat-tawwabur-rahim.",
        translation: 'Ya Tuhan kami, jadikanlah kami orang yang berserah diri kepada-Mu, dan dari anak cucu kami (jadikanlah) umat yang berserah diri kepada-Mu dan tunjukkanlah kepada kami cara-cara ibadah kami, dan terimalah tobat kami. Sungguh, Engkaulah Yang Maha Penerima tobat, Maha Penyayang.',
        source: 'QS. Al-Baqarah: 128',
        ayahNumber: 135
    },
    {
        id: '3',
        title: 'Doa Kebaikan Dunia Akhirat (Sapu Jagat)',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        latin: "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adzaban-nar.",
        translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
        source: 'QS. Al-Baqarah: 201',
        ayahNumber: 208
    },
    {
        id: '4',
        title: 'Doa Keteguhan & Kesabaran Menghadapi Lawan',
        arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
        latin: "Rabbana afrigh 'alaina sabraw wa tsabbit aqdamana wansurna 'alal-qaumil-kafirin.",
        translation: 'Ya Tuhan kami, limpahkanlah kesabaran kepada kami, kukuhkanlah langkah kami, dan menangkanlah kami atas kaum yang kafir.',
        source: 'QS. Al-Baqarah: 250',
        ayahNumber: 257
    },
    {
        id: '5',
        title: 'Doa Mohon Ampun atas Lupa & Khilaf',
        arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطأْنَا',
        latin: "Rabbana la tu'akhidzna in-nasina au akhta'na.",
        translation: 'Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami melakukan kesalahan.',
        source: 'QS. Al-Baqarah: 286',
        ayahNumber: 293
    },
    {
        id: '6',
        title: 'Doa Mohon Keringanan Beban Hidup',
        arabic: 'رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا',
        latin: "Rabbana wala tahmil 'alaina isran kama hamaltahu 'alal-ladzina min qablina.",
        translation: 'Ya Tuhan kami, janganlah Engkau bebani kami dengan beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami.',
        source: 'QS. Al-Baqarah: 286',
        ayahNumber: 293
    },
    {
        id: '7',
        title: 'Doa Mohon Kemampuan & Kemenangan',
        arabic: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
        latin: "Rabbana wala tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna anta maulana fansurna 'alal-qaumil-kafirin.",
        translation: 'Ya Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tidak sanggup kami memikulnya. Maafkanlah kami, ampunilah kami, dan rahmatilah kami. Engkaulah pelindung kami, maka tolonglah kami menghadapi orang-orang kafir.',
        source: 'QS. Al-Baqarah: 286',
        ayahNumber: 293
    },
    {
        id: '8',
        title: 'Doa Keteguhan Hati dalam Hidayah',
        arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
        latin: "Rabbana la tuzigh qulubana ba'da idz hadaitana wa hab lana mil ladunka rahmah innaka antal-wahhab.",
        translation: 'Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau berikan petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu. Sungguh, Engkaulah Maha Pemberi.',
        source: 'QS. Ali \'Imran: 8',
        ayahNumber: 301
    },
    {
        id: '9',
        title: 'Doa Ampunan & Perlindungan Siksa Neraka',
        arabic: 'رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ',
        latin: "Rabbana innana amanna faghfir lana dzunubana wa qina 'adzaban-nar.",
        translation: 'Ya Tuhan kami, sesungguhnya kami telah beriman, maka ampunilah segala dosa kami dan peliharalah kami dari siksa neraka.',
        source: 'QS. Ali \'Imran: 16',
        ayahNumber: 309
    },
    {
        id: '10',
        title: 'Doa Mohon Keturunan yang Baik (Nabi Zakariya عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ',
        latin: "Rabbi hab li mil ladunka dzurriyyatan tayyibatan innaka sami'ud-du'a.",
        translation: 'Ya Tuhanku, berilah aku keturunan yang baik dari sisi-Mu, sesungguhnya Engkau Maha Pendengar doa.',
        source: 'QS. Ali \'Imran: 38',
        ayahNumber: 331
    },
    {
        id: '11',
        title: 'Doa Taubat dan Penyesalan (Nabi Adam عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
        latin: "Rabbana zhalamna anfusana wa il lam taghfir lana wa tarhamna lanakunanna minal-khasirin.",
        translation: 'Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya kami termasuk orang-orang yang rugi.',
        source: 'QS. Al-A\'raf: 23',
        ayahNumber: 977
    },
    {
        id: '12',
        title: 'Doa Husnul Khatimah',
        arabic: 'رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ',
        latin: "Rabbana faghfir lana dzunubana wa kaffir 'anna sayyi'atina wa tawaffana ma'al-abrar.",
        translation: 'Ya Tuhan kami, ampunilah dosa-dosa kami dan hapuskanlah kesalahan-kesalahan kami, dan wafatkanlah kami beserta orang-orang yang berbakti.',
        source: 'QS. Ali \'Imran: 193',
        ayahNumber: 486
    },
    {
        id: '13',
        title: 'Doa Keamanan Negeri (Nabi Ibrahim عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبِّ اجْعَلْ هَٰذَا الْبَلَدَ آمِنًا وَاجْنُبْنِي وَبَنِيَّ أَن نَّعْبُدَ الْأَصْنَامَ',
        latin: "Rabbij'al hadzal-balada aminaw-wajnubni wa baniyya an na'budal-ashnam.",
        translation: 'Ya Tuhanku, jadikanlah negeri ini (Mekah), negeri yang aman, dan jauhkanlah aku beserta anak cucuku dari menyembah berhala-berhala.',
        source: 'QS. Ibrahim: 35',
        ayahNumber: 1740
    },
    {
        id: '14',
        title: 'Doa Dimudahkan Salat (Nabi Ibrahim عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
        latin: "Rabbij'alni muqimas-shalati wa min dzurriyyati rabbana wa taqabbal du'a.",
        translation: 'Ya Tuhanku, jadikanlah aku dan anak cucuku orang yang tetap melaksanakan salat, ya Tuhan kami, perkenankanlah doaku.',
        source: 'QS. Ibrahim: 40',
        ayahNumber: 1745
    },
    {
        id: '15',
        title: 'Doa Ampunan Orang Tua & Mukmin (Nabi Ibrahim عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُوْمُ الْحِسَابُ',
        latin: "Rabbanaghfir li wa li-walidayya wa lil-mu'minina yauma yaqumul-hisab.",
        translation: 'Ya Tuhan kami, ampunilah aku dan kedua ibu bapakku dan semua orang yang beriman pada hari diadakan perhitungan (hari Kiamat).',
        source: 'QS. Ibrahim: 41',
        ayahNumber: 1746
    },
    {
        id: '16',
        title: 'Doa Kelancaran Bicara & Kelapangan Dada (Nabi Musa عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
        latin: "Rabbisy-syrah li shadri wa yassir li amri wahlul 'uqdatam mil-lisani yafqahu qauli.",
        translation: 'Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah untukku urusanku, dan lepaskanlah kekakuan dari lidahku, agar mereka mengerti perkataanku.',
        source: 'QS. Thaha: 25-28',
        ayahNumber: 2373
    },
    {
        id: '17',
        title: 'Doa Tambahan Ilmu (Nabi Muhammad ﷺ)',
        arabic: 'رَّبِّ زِدْنِي عِلْمًا',
        latin: "Rabbi zidni 'ilma.",
        translation: 'Ya Tuhanku, tambahkanlah ilmu kepadaku.',
        source: 'QS. Thaha: 114',
        ayahNumber: 2462
    },
    {
        id: '18',
        title: 'Doa Kesembuhan (Nabi Ayub عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
        latin: "Anni massaniyad-durru wa anta arhamur-rahimin.",
        translation: '(Ya Tuhanku), sesungguhnya aku telah ditimpa penyakit dan Engkau adalah Tuhan Yang Maha Penyayang di antara semua penyayang.',
        source: 'QS. Al-Anbiya: 83',
        ayahNumber: 2566
    },
    {
        id: '19',
        title: 'Doa Terhindar dari Kesulitan (Nabi Yunus عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        latin: "La ilaha illa anta subhanaka inni kuntu minazh-zhalimin.",
        translation: 'Tidak ada tuhan selain Engkau, Mahasuci Engkau. Sungguh, aku termasuk orang-orang yang zalim.',
        source: 'QS. Al-Anbiya: 87',
        ayahNumber: 2570
    },
    {
        id: '20',
        title: 'Doa Penyejuk Mata & Kepemimpinan Taqwa',
        arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْواجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
        latin: "Rabbana hab lana min azwajina wa dzurriyyatina qurrata a'yuniv-waj'alna lil-muttaqina imama.",
        translation: 'Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.',
        source: 'QS. Al-Furqan: 74',
        ayahNumber: 2929
    },
    {
        id: '21',
        title: 'Doa Syukur & Amal Saleh (Nabi Sulaiman عَلَيْهِ ٱلسَّلَامُ)',
        arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
        latin: "Rabbi auzi'ni an asykura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala shalihan tardhahu wa adkhilni birahmatika fi 'ibadikas-shalihin.",
        translation: 'Ya Tuhanku, anugerahkanlah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku dan agar aku mengerjakan kebajikan yang Engkau ridai; dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang saleh.',
        source: 'QS. An-Naml: 19',
        ayahNumber: 3178
    },
    {
        id: '22',
        title: 'Doa Ampunan bagi Diri & Saudara Seiman',
        arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ',
        latin: "Rabbanaghfir lana wa li-ikhwaninal-ladzina sabaquna bil-imani wala taj'al fi qulubina ghillal-lilladzina amanu rabbana innaka ra'ufur-rahim.",
        translation: 'Ya Tuhan kami, ampunilah kami dan saudara-saudara kami yang telah beriman lebih dahulu dari kami, dan janganlah Engkau tanamkan kedengkian dalam hati kami terhadap orang-orang yang beriman. Ya Tuhan kami, Sungguh, Engkau Maha Penyantun, Maha Penyayang.',
        source: 'QS. Al-Hasyr: 10',
        ayahNumber: 5114
    },
    {
        id: '23',
        title: 'Doa Tawakal kepada Allah ﷻ',
        arabic: 'رَّبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ',
        latin: "Rabbana 'alaika tawakkalna wa ilaika anabna wa ilaikal-mashir.",
        translation: 'Ya Tuhan kami, hanya kepada Engkaulah kami bertawakal dan hanya kepada Engkaulah kami bertobat dan hanya kepada Engkaulah kami kembali.',
        source: 'QS. Al-Mumtahanah: 4',
        ayahNumber: 5154
    },
    {
        id: '24',
        title: 'Doa Kesempurnaan Cahaya & Ampunan',
        arabic: 'رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        latin: "Rabbana atmim lana nurana waghfir lana innaka 'ala kulli syai'in qadir.",
        translation: 'Ya Tuhan kami, sempurnakanlah untuk kami cahaya kami dan ampunilah kami; Sungguh, Engkau Mahakuasa atas segala sesuatu.',
        source: 'QS. At-Tahrim: 8',
        ayahNumber: 5249
    }
];

export const QARIS = [
  { identifier: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { identifier: 'ar.abdulsamad', name: 'Abdul Basit Abdus Samad' },
  { identifier: 'ar.huzayfi', name: 'Ali Hudhaifi' },
  { identifier: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
];

// New constants for HadithCard and MediaCarousel titles (translation keys)
export const MEDIA_CAROUSEL_TITLES = {
    videoTutorialTitle: 'videoTutorialTitle',
    readingQuranVirtuesTitle: 'readingQuranVirtuesTitle',
    oneLetterRewardTitle: 'oneLetterRewardTitle',
};

export const HADITH_TRANSLATION = {
    hadithTranslationText: 'hadithTranslationText',
    hadithSource: 'hadithSource',
    playArabicHadithAudio: 'playArabicHadithAudio',
    playHadithTranslationAudio: 'playHadithTranslationAudio'
};