// Guest book entries. The site sorts them newest first.
// name_en / name_th: null until the guest is identified. The page then shows "Clinic guest".
// name_checked: false where Gid identified the guest but is not sure. Confirm with her at turnover.
// photo: file in assets/guests. focus: the part of the photo to keep when a card crops it.
// source: the Instagram post the photo came from.
// permission: false until the guest or their management agrees in writing (see PLAN.md, At turnover).
window.GUESTS = [
  { id: "sea-tawinan-2026-10", name_en: "Sea Tawinan", name_th: "ซี ฐวิณัณ", date: "2026-10", photo: "assets/guests/sea-tawinan-2026-10.jpg", focus: "50% 45%", source: "https://www.instagram.com/doraepop/p/DfKAXErj_xn/", permission: false },
  { id: "sea-tawinan-2026-07", name_en: "Sea Tawinan", name_th: "ซี ฐวิณัณ", date: "2026-07", photo: "assets/guests/sea-tawinan-2026-07.jpg", focus: "50% 50%", source: "https://www.instagram.com/doraepop/p/DbQeMjCj1qw/", permission: false },
  { id: "satang-kittiphop", name_en: "Satang Kittiphop", name_th: "สตางค์ กิตติภพ", date: "2026-06", photo: "assets/guests/satang-kittiphop.jpg", focus: "50% 40%", source: "https://www.instagram.com/doraepop/p/DaLV8GCDzGW/", permission: false },
  { id: "gemini-norawit", name_en: "Gemini Norawit", name_th: "เจมีไนน์ นรวิชญ์", date: "2026-03", photo: "assets/guests/gemini-norawit.jpg", focus: "60% 35%", source: "https://www.instagram.com/p/DVgUnQYj3k5/", permission: false },
  { id: "junior-kanokpob", name_en: "Junior Kanokpob", name_th: "จูเนียร์ กนกพบ", date: "2025-08", photo: "assets/guests/junior-kanokpob.jpg", focus: "62% 35%", source: "https://www.instagram.com/p/DN2rKZd3tn_/", permission: false },
  { id: "ohm-tpk", name_en: "Ohm TPK", name_th: "โอม TPK", name_checked: false, date: "2025-05", photo: "assets/guests/ohm-tpk.jpg", focus: "45% 30%", source: "https://www.instagram.com/p/DKRTJr5PmuF/", permission: false },
  { id: "book-kasidet", name_en: "Book Kasidet", name_th: "บุ๊ค กษิดิ์เดช", name_checked: false, date: "2025-01", photo: "assets/guests/book-kasidet.jpg", focus: "50% 50%", source: "https://www.instagram.com/p/DE2JZacyY_M/", permission: false },
  { id: "sea-tawinan-2025", name_en: "Sea Tawinan", name_th: "ซี ฐวิณัณ", date: "2025-01", photo: "assets/guests/sea-tawinan-2025.jpg", focus: "45% 50%", source: "https://www.instagram.com/p/DE2JielSx7I/", permission: false },
  { id: "sea-tawinan-2023", name_en: "Sea Tawinan", name_th: "ซี ฐวิณัณ", date: "2023-05", photo: "assets/guests/sea-tawinan-2023.jpg", focus: "42% 50%", source: "https://www.instagram.com/p/Cr02KQprtt-/", permission: false },
  { id: "jimmy-jitaraphol", name_en: "Jimmy Jitaraphol", name_th: "จิมมี่ จิตรพล", date: "2023-05", photo: "assets/guests/jimmy-jitaraphol.jpg", focus: "48% 50%", source: "https://www.instagram.com/p/Crz5CekLZWd/", permission: false }
];
