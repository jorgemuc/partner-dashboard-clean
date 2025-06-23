# Partner Cockpit Dashboard – Clean Slate 🇩🇪/🇬🇧

Ein ultraleichtes **Electron-Desktop-Frontend**, das beliebige CSV-Dateien
einliest, tabellarisch anzeigt und sofort filter-/durchsuchbar macht.  
Ziel: Einfacher, portabler Viewer & Editor für Partner-Stammdaten – ohne
komplexe Build-Kette oder Cloud-Abhängigkeiten.

---

## Features (v0.1.4)


| ✔ | Funktion |
|---|-----------|
| CSV-Upload per Dateidialog & Drag-and-Drop |
| Automatisches Tabellen-Rendering mit Kopfzeile |
| Sofort-Suche & Zeilenfilter |
| Einfache Text-Filter pro Spalte |
| Paginierung & Spalten-Menü |
| Dark-/Light-Umstellung (Tailwind) |
| KPI-Tiles & Diagramme |
| Kartenansicht für Partner |
| Undo-/Redo-Stack (max. 5 Schritte) |
| Spalten-Ansichten (Alle/Vertrag/Tech/Onboarding/Marketing/KPI) |
| CSV & XLSX Export |
| 100 % offline, keine Install/Rights nötig |

![Dashboard Screenshot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HwAFAgH+OhzCEwAAAABJRU5ErkJggg==)

> *Roadmap:* CI-Workflow & erweiterte Dokumentation

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
npm install   # dekodiert auch Icons aus *.b64

# 3) App starten
npm start

# 4) Tests ausführen
npm test

# 5) Windows Build erzeugen
npm run build:win32

Die portable EXE findet sich anschließend unter `dist/Partner Cockpit Dashboard.exe`.

Für einen kompletten UI-Test kann die Datei demo/PARTNER.csv mit allen Spalten importiert werden.

## Troubleshooting

- **Fehlerhafte Spaltenanzahl** – prüfen, ob jede Zeile gleich viele Trennzeichen besitzt.
- **Falsche Kodierung** – CSV am besten als UTF‑8 ohne BOM speichern.
- **Unerwartete Trennzeichen** – Komma oder Semikolon müssen einheitlich sein.


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
