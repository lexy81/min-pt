# Min PT

En responsiv norsk treningsdagbok som kan installeres som en Progressive Web App. Treningsøktene, fullførte øvelser, kroppsvekt, egne øvelser og tema lagres lokalt i nettleseren.

## Start appen

Appen bruker en service worker og må derfor kjøres via `localhost` eller HTTPS (ikke åpnes som en `file://`-fil). Fra prosjektmappen kan du for eksempel starte en lokal server:

```sh
python -m http.server 8000
```

Gå til `http://localhost:8000`. Bruk installasjonsknappen i appen når nettleseren tilbyr installasjon. Appens grunnfiler bufres for bruk uten nett etter første besøk.

## Funksjoner

- Treningsprogram for mandag, onsdag og fredag med avkryssing av øvelser
- Illustrasjon og enkel teknikkforklaring ved hver øvelse
- Registrer løftevekt for hver styrkeøvelse, med forrige vekt som hint
- Fremgangsgraf for løftevekt med valg av øvelse
- Kroppsvekt med historikk og utviklingsgraf
- Egne øvelser med mulighet for å fjerne dem
- Private fremgangsbilder knyttet til dato og treningsdag
- Mørkt og lyst tema, med mørkt tema som standard
- Lokal lagring og støtte for installasjon/frakoblet bruk

Fremgangsbilder lagres i nettleserens lokale bildelager og komprimeres for å spare plass. De lastes ikke opp. Løftevekter lagres per øvelse og treningsdato, og forrige registrering vises som hjelp. Bruk «Slett alle data» i innstillingene for å slette bilder og treningsdata fra enheten.
