# NA Sverige Kalender

Refaktorerad kalenderapp med publik kalender och inbyggd lösenordsskyddad admin i samma app.

## Filer

- `index.html` - publik kalender och adminvy via `#admin`.
- `admin.html` - vidarekoppling till `index.html#admin` för gamla länkar.
- `css/styles.css` - gemensam styling inspirerad av möteslistans layout.
- `js/app.js` - växlar mellan kalender- och adminvy.
- `js/config.js` - Supabase-konfiguration, adminlösenord i base64 och importintervall.
- `js/api.js` - gemensam Supabase-klient.
- `js/calendar.js` - publik kalenderlogik.
- `js/admin.js` - lösenord, manuell hantering och importlogik.

## Viktigt

Importen använder `/event?page=...` precis som tidigare. Den endpointen behöver därför finnas kvar i Cloudflare/Pages.

Importerade event uppdateras med `source,external_slug` som nyckel. Manuella event kan skapas, redigeras, döljas och tas bort i admin.

Kalendern visar `Senast uppdaterad/importerad` baserat på nyaste `updated_at` i hämtade kalenderposter. Importen sätter `updated_at` när poster uppdateras.

Kostnad visas i kalenderkort och kan anges på manuella händelser i admin. Om kostnaden bara är en siffra visas den med `kr` efter beloppet. Beskrivning och ingress renderas med bevarade stycken, punktlistor, numrerade listor och enkel fetmarkering med `**text**`.

Admininloggning sparas i `sessionStorage`, vilket betyder att den normalt gäller i samma webbläsarflik tills fliken stängs.

Manuella händelser i admin kan kopieras. Kopiering fyller formuläret med samma uppgifter men sparar som en ny händelse.

Importerade händelser som har `image_url` visar en liten bild i kalenderkortet samt en länk till originalbilden.

Plats/adress i kalenderkort länkar till Google Maps. Tillbaka-knappen går till `https://www.nasverige.org/`.

Headern är låst/sticky vid scroll. Textfält som innehåller markdown-länkar, till exempel `[Teams](https://...)`, och vanliga `https://...`-adresser blir klickbara länkar.

Bildlänkar i textfält, till exempel `.svg`, `.png` och `.jpg`, visas som en liten inline-ikon med länktext, inte som stor bildpreview.

Admin öppnas via `?view=admin`. Gamla länkar med `#admin` stöds fortfarande men normaliseras automatiskt till `?view=admin`.

Admin- och kalenderknapparna växlar vy internt utan sidladdning. Bildlänkar tolererar nu avslutande citattecken eller punkt efter URL:en.

Automatisk import i denna version körs när admin öppnas, om funktionen är aktiverad och senaste importen är äldre än intervallet i `js/config.js`. För helt serverstyrd import utan att någon öppnar admin behövs en Cloudflare Scheduled Worker/Cron med serverhemligheter.
