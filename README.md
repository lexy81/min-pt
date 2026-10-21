# Min PT

En responsiv norsk treningsdagbok som kan installeres som en Progressive Web App. Treningsøktene, fullførte øvelser, kroppsvekt, egne øvelser og tema lagres lokalt i nettleseren.

## Start appen

Appen bruker en service worker og må derfor kjøres via `localhost` eller HTTPS (ikke åpnes som en `file://`-fil). Fra prosjektmappen kan du for eksempel starte en lokal server:

```sh
python -m http.server 8000
```

Gå til `http://localhost:8000`. Bruk installasjonsknappen i appen når nettleseren tilbyr installasjon. Appens grunnfiler bufres for bruk uten nett etter første besøk.

## Funksjoner

- Tre treningsøkter med justerbare ukedager, avkryssing av øvelser og datoført treningshistorikk
- Naviger mellom oversikt, trening, progresjon, kroppsvekt, bilder og innstillinger via en fast menylinje øverst
- Registrer ekstra treningsøkter på valgfri dato, også på dager utenfor den faste ukeplanen
- Registrer gruppetimer fra Plankebyen Trenings timebeskrivelser og velg dato i kalenderen
- Se gruppetime-statistikk med antall deltakelser, variasjon og mest besøkte time
- Tilpass treningsplanen ved å legge til øvelser på valgt dag eller fjerne dem
- Oppvarmings- og kondisjonslogg for tredemølle, sykling, gåtur, ellipsemaskin og stakemaskin med tid i minutter og sekunder; legg til distanse, hastighet, stigning, tempo eller kommentar ved behov
- Kondisjonsgraf med oppsummering for siste 7 eller 30 dager
- Hvileklokke med valgbare pauser mellom sett
- Rediger tidligere kroppsvekt-, kondisjons- og løftevektregistreringer
- Eksporter og importer sikkerhetskopi med treningsbilder
- Treningskortene viser maskinbilder der de finnes, og illustrasjoner ellers, også ved bruk uten nett
- Tydeligere, fargekodede treningsillustrasjoner med apparat, utøver og bevegelsesretning, pluss teknikkforklaring ved hver øvelse
- Registrer løftevekt for hver styrkeøvelse, med forrige vekt som hint

- Fremgangsgraf for løftevekt med valg av øvelse
- Kroppsvekt med historikk og utviklingsgraf
- Egne øvelser med mulighet for å fjerne dem
- Private fremgangsbilder knyttet til dato og treningsdag
- Ta fremgangsbilde direkte med kameraet, eller velg fra telefonens bilder
- Mørkt og lyst tema, med mørkt tema som standard
- Lokal lagring og støtte for installasjon/frakoblet bruk

Fremgangsbilder lagres i nettleserens lokale bildelager og komprimeres for å spare plass. De lastes ikke opp. Sikkerhetskopien inneholder treningsdata og bilder i én JSON-fil; import erstatter dataene på enheten etter bekreftelse. Løftevekter lagres per øvelse og treningsdato, og forrige registrering vises som hjelp. Bruk «Slett alle data» i innstillingene for å slette bilder og treningsdata fra enheten.
