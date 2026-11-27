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
Dispatch system: run "node server.js". Staff portal at /portal. Public site at /

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
Run:  ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=StrongPass1 node server.js
Open: http://localhost:3000/portal   (public site: /)
Roles: marketer (onboards clients, sees own earnings, requests withdrawals),
       installer (sees only assigned jobs, completes with 2 photos),
       admin (everything: accounts, dispatch, withdrawals).
Data is stored in DATA_DIR (default ./data). On Render this needs the persistent disk in render.yaml.
Marketer commission = 40% of the package price, credited when the client is onboarded.
