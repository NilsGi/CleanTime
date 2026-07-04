# NA Sverige Kalender

Refaktorerad kalenderapp med publik kalender och lösenordsskyddad admin.

## Filer

- `index.html` - publik kalender med lista, vecka, månad, filter och ICS-export.
- `admin.html` - admin för import från nasverige.org och manuella kalenderposter.
- `css/calendar.css` - styling för publika kalendern.
- `css/admin.css` - styling för admin.
- `js/config.js` - Supabase-konfiguration, adminlösenord i base64 och importintervall.
- `js/api.js` - gemensam Supabase-klient.
- `js/calendar.js` - publik kalenderlogik.
- `js/admin.js` - lösenord, manuell hantering och importlogik.

## Viktigt

Importen använder `/event?page=...` precis som tidigare. Den endpointen behöver därför finnas kvar i Cloudflare/Pages.

Importerade event uppdateras med `source,external_slug` som nyckel. Manuella event kan skapas, redigeras, döljas och tas bort i admin.

Automatisk import i denna version körs när admin öppnas, om funktionen är aktiverad och senaste importen är äldre än intervallet i `js/config.js`. För helt serverstyrd import utan att någon öppnar admin behövs en Cloudflare Scheduled Worker/Cron med serverhemligheter.
