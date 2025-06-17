# Partner Cockpit Dashboard – Clean Slate 🇩🇪/🇬🇧

Ein ultraleichtes **Electron-Desktop-Frontend**, das beliebige CSV-Dateien
einliest, tabellarisch anzeigt und sofort filter-/durchsuchbar macht.  
Ziel: Einfacher, portabler Viewer & Editor für Partner-Stammdaten – ohne
komplexe Build-Kette oder Cloud-Abhängigkeiten.

---

## Features (v0.1)

| ✔ | Funktion |
|---|-----------|
| CSV-Upload per Dateidialog |
| Automatisches Tabellen-Rendering mit Kopfzeile |
| Sofort-Suche & Zeilenfilter |
| Dark-/Light-Umstellung (Tailwind) |
| Undo-/Redo-Stack (max. 5 Schritte) |
| 100 % offline, keine Install/Rights nötig |

> *Roadmap:* XLSX-Export · KPI-Tiles · Drag-&-Drop-Upload · Karten-Ansicht  
> → Siehe [Issues](../../issues).

---

## Tech-Stack

| Layer | Tech |
|-------|------|
| **Desktop Shell** | Electron v26 |
| **UI Framework** | HTML + Tailwind CDN |
| **CSV-Parser** | Papa Parse v5 |
| **Build** | npm scripts (kein extra Bundler) |

---

## Quick Start

```bash
# 1) Repo klonen
git clone https://github.com/<your-name>/partner-dashboard-clean.git
cd partner-dashboard-clean

# 2) Abhängigkeiten einmalig installieren
npm install

# 3) App starten
npm start

# 4) Tests ausführen
npm test

# 5) Windows Build erzeugen
npm run build:win32

Die portable EXE findet sich anschließend unter `dist/Partner Cockpit Dashboard.exe`.

Für einen kompletten UI-Test kann die Datei demo/PARTNER.csv mit allen Spalten importiert werden.

## CSV-Schema v1.0

```
Partnername, Systemname, Partnertyp, Branche, Land, Website, Vertragsstatus,
Vertragstyp, Vertragsbeginn, Vertragsende, Kündigungsfrist, Modul/Zweck,
Schnittstelle, Format, API URL, Schnittstellenstatus, Anzahl_Kunden,
Anzahl_Liegenschaften, Anzahl_NE, Nutzungsfrequenz, Störungen_90d, Score,
Ansprechpartner_Name, Ansprechpartner_E-Mail, Telefon, Rolle, Landingpage,
Webinar_Termine, Marketingkampagne, Produktflyer_URL, Präsentation_URL,
Referenzprojekte, Schulungstypen, Schulungsunterlagen, Trainingsstatus,
Developer_Portal_Zugang
```

Fehlende Spalten werden beim Import automatisch ergänzt; zusätzliche Spalten werden ans Tabellenende angefügt.
