// Treatments and prices in baht.
// simulated: true means the item or price is a stand-in until her real price list arrives (see PLAN.md, At turnover).
window.TREATMENTS = {
  skin: [
    { id: "ulthera", th: "อัลเทอร่า ยกกระชับทั่วหน้า", en: "Ulthera full face lift", detail_th: "300 เส้น · ใช้เวลา 60 นาที · ไม่ต้องพักฟื้น", detail_en: "300 lines · 60 minutes · no downtime", price: 29000, was: 48000, source: "GoWabi", simulated: false },
    { id: "thermage", th: "เทอร์มาจ FLX ทั่วหน้า", en: "Thermage FLX full face", detail_th: "กระชับผิว กระตุ้นคอลลาเจน", detail_en: "Tightening and collagen renewal", price: 45000, simulated: true },
    { id: "cellec-v", th: "เลเซอร์หน้าใส Cellec V", en: "Cellec V brightening laser", detail_th: "ฝ้า กระ จุดด่างดำ สิว ผิวแดง", detail_en: "Pigmentation, acne, redness and dull skin", price: 2900, simulated: true },
    { id: "botox", th: "โบท็อกซ์ ลดริ้วรอย", en: "Botox for lines", detail_th: "หน้าผาก หว่างคิ้ว หางตา", detail_en: "Forehead, frown lines, crow's feet", price: 4900, simulated: true },
    { id: "filler", th: "ฟิลเลอร์", en: "Filler", detail_th: "ใต้ตา ร่องแก้ม คาง ปาก", detail_en: "Under eyes, smile lines, chin, lips", price: 12900, unit_th: "ต่อ 1 cc", unit_en: "per 1 cc", simulated: true },
    { id: "acne", th: "รักษาสิว กดสิวโดยแพทย์", en: "Acne care with extraction by the doctor", detail_th: "คุณหมอกดสิวให้เอง", detail_en: "Dr. Poppy does the extraction herself", price: 1500, simulated: true },
    { id: "meso", th: "เมโสหน้าใส", en: "Brightening meso", detail_th: "ผิวหมองคล้ำ ผิวขาดน้ำ", detail_en: "Dull or dehydrated skin", price: 2500, simulated: true },
    { id: "laser-hair", th: "เลเซอร์กำจัดขน", en: "Laser hair removal", detail_th: "รักแร้", detail_en: "Underarms", price: 1900, simulated: true }
  ],
  dental: [
    { id: "scaling", th: "ขูดหินปูน ขัดฟัน", en: "Scaling and polishing", price: 1200, simulated: true },
    { id: "whitening", th: "ฟอกสีฟัน", en: "Teeth whitening", price: 7900, simulated: true },
    { id: "filling", th: "อุดฟัน", en: "Fillings", price: 1000, unit_th: "เริ่มต้น", unit_en: "from", simulated: true },
    { id: "veneer", th: "วีเนียร์", en: "Veneers", price: 15000, unit_th: "ต่อซี่", unit_en: "per tooth", simulated: true },
    { id: "clear-aligner", th: "จัดฟันใส", en: "Clear aligners", price: 59000, unit_th: "เริ่มต้น", unit_en: "from", simulated: true }
  ],
  bridal: [
    { id: "bride-skin", th: "เตรียมผิวเจ้าสาว 3 เดือน", en: "Bridal skin, 3 months", detail_th: "อัลเทอร่า เมโสหน้าใส 3 ครั้ง ดูแลสิวก่อนวันงาน", detail_en: "Ulthera, 3 brightening meso sessions, acne care before the day", price: 39000, simulated: true },
    { id: "bride-smile", th: "รอยยิ้มเจ้าสาว", en: "Bridal smile", detail_th: "ขูดหินปูน ฟอกสีฟัน", detail_en: "Scaling and whitening", price: 8500, simulated: true },
    { id: "bride-full", th: "เจ้าสาวครบชุด ผิวและฟัน", en: "Bride, skin and teeth", detail_th: "ทั้งสองแพ็กเกจ นัดตามวันงาน", detail_en: "Both packages, booked around your date", price: 45000, simulated: true }
  ]
};

window.MACHINES = [
  { id: "ulthera", name: "Ulthera", maker: "Merz Aesthetics", use_th: "ยกกระชับด้วยอัลตราซาวด์", use_en: "Ultrasound lifting", photo: null, serial: "UL-0000-0000", simulated_serial: true },
  { id: "thermage", name: "Thermage FLX", maker: "Solta Medical", use_th: "กระชับผิวด้วยคลื่นวิทยุ", use_en: "Radiofrequency tightening", photo: "assets/machines/thermage-flx.jpg", serial: "TF-0000-0000", simulated_serial: true },
  { id: "cellec-v", name: "Cellec V", maker: "Jeisys", use_th: "เลเซอร์หน้าใส 6 โหมด", use_en: "Six-mode brightening laser", photo: "assets/machines/cellec-v.jpg", serial: "CV-0000-0000", simulated_serial: true }
];
