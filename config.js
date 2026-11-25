/* ===== Rizz Tetebatu: contact, prices and photos =====
   This is the file to change for prices, phone number, social accounts and photos.
   Keep the commas, quotes and brackets exactly as they are.
   Prices are in rupiah without dots: 350000 shows on the site as "IDR 350K".
   A tour without "idr" shows "Price on WhatsApp". */
const CONFIG = {
  whatsapp: "6283114613953",            // number with country code, no + or spaces
  instagram: "rizztetebatu",
  tiktok: "rizztetebatu",               // TikTok name without @, or "" to hide the link
  email: "rizztetebatu@gmail.com",
  googleMapsUrl: "",                    // link to the Google Maps profile
  googleReviewUrl: "",                  // the "write a review" link from Google Business Profile
  photos: { about: "img/rizz.jpg" },
  tours: [                              // the text of each tour lives in lang/<language>.js under tour_<id>_...
    { id:"rice",    hours:"2-3",  start:"08:30", level:"easy",  idr:150000, photo:"img/rice.jpg" },
    { id:"water",   hours:"4-5",  start:"08:30", level:"mod",   idr:250000, photo:"img/water.jpg" },
    { id:"classic", hours:"6-7",  start:"08:30", level:"mod",   idr:350000, photo:"img/monkeys.jpg" },
    { id:"rinjani", hours:"2D1N / 3D2N", start:"", level:"hard", photo:"img/rinjani.jpg" }
  ]
};

