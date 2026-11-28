# Denop Systems ISP Website

Public marketing website for:

  Denop Systems
  ├── Excom Streaming Services  → Fibre Internet
  └── Denop Hostel WiFi         → Prepaid & Voucher Hotspot

## Contact
- Phone / WhatsApp: 0704 682 970  and  0706 500 792
- Email: denopcomputers@gmail.com

## Packages

Fibre (Excom Streaming Services)
- Basic       : UGX 50,000 / month  – up to 30 Mbps
- Chiva       : UGX 75,000 / month  – up to 60 Mbps
- Challenger : UGX 130,000 / month – up to 100 Mbps

Hotspot (Denop Hostel WiFi)
- 24 Hours : UGX 1,000
- 1 Week   : UGX 5,000
- 1 Month  : UGX 20,000

## Design
Fonts: change --fh (headings) at the top of styles.css and portal.css, and the Google Fonts link in index.html/portal.html. Premium ISP site + dispatch portal. Run "node server.js". Site at /, staff portal at /portal. Real photos: add images/pole.jpg, splice.jpg, home.jpg, hotspot.jpg and the "Our work" section appears automatically. Support hours: edit SUPPORT in script.js. Marketer commission (40%) is credited when the installer marks the job done.

## Fibre Coverage (Now available)
Kabalagala • Kansanga • Muyenga • Kiwafu • Luwafu • Kitalanga • Soya • Bunga • Kiwempe
Salaama Road • Munyonyo • Kibuli • Bukasa • Kizungu

Still expanding across Kampala — contact us if your area is not listed.

## Deploy on Render (Static Site)
1. Create account at https://render.com
2. New + → Static Site
3. Upload the website folder (or connect Git)
4. Build Command: leave empty
5. Publish Directory: .
6. Deploy

Alternatively use Netlify, Vercel, GitHub Pages or any static hosting.

WhatsApp form submissions go to 0704 682 970 by default.

== DISPATCH PORTAL ==
Run:  node server.js   (first admin: onenrogers@gmail.com / 12345678 — you are forced to change it at first login)
Open: http://localhost:3000/portal   (public site: /)
Roles: marketer (onboards clients, sees own earnings, requests withdrawals),
       installer (sees only assigned jobs, completes with 2 photos),
       admin (everything: accounts, dispatch, withdrawals).
Data is stored in DATA_DIR (default ./data). On Render this needs the persistent disk in render.yaml.
Marketer commission = 40% of the package price, credited when the client is onboarded.
