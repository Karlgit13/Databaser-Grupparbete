Se ER-diagrammet på dbdiagram.io: https://dbdiagram.io/d/687e11fef413ba3508dc530a (alternativt i ER-diagram mappen)

----- Instruktioner -----
jsd24-Databaser-25yhp-Grupp-Examination-SQL-bulletin
Grupp examination: SQL med PostgreSQL - SQL bulletin
Instruktioner
Ni ska i denna examination bygga ett API och en databas för en tjänst som fungerar som en enkel anslagstavla. En användare kan posta ett meddelande till en kanal som denna "prenumererar" på samt se andra meddelanden som finns i den kanalen. Tänk typ väldigt enkla Facebook grupper.

En användare kan äga ingen eller flera olika kanaler (t.ex. “Filmälskare”).
En användare kan prenumerera/bli medlem på noll eller flera kanaler.
En användare kan endast posta meddelanden i kanaler de prenumererar på.
En användare kan endast se meddelanden i de kanaler de är med i.
Ett meddelande:
tillhör enbart en kanal (för godkänt)
skrivs av exakt en användare
En kanal:
har exakt en ägare (en användare)
kan innehålla noll eller flera meddelanden
🛠️ Arbetsgång

1. 📐 ER-diagram
   Börja med att modellera ert system i ett ER-diagram:

Identifiera entiteter och relationer
Fundera över 1–1, 1–M och M–M-relationer
Tips: dbdiagram.io är ett bra verktyg
Funderingar:
Kan en användare vara med i flera kanaler?
Kan en användare skapa flera kanaler?
Kan ett meddelande ligga i flera kanaler (eller bara en)?
Hur ser relationen ut mellan användare och meddelanden?
Hur ser relationen ut mellan meddelanden och kanaler? 2. 🗃️ PostgreSQL-databas
Skapa databasen och tabellerna enligt ert ER-diagram
Använd lämpliga datatyper, primärnycklar och främmande nycklar
Om många-till-många-relationer behövs, använd junction-tabeller 3. 🔌 Node.js/Express API
Sätt upp ett Express-API som kopplas till er databas

I varje route ska ni använda SQL-syntax (pool.query(...)) för att skapa/hämta data

API:t ska stödja t.ex:

Skapa användare, kanaler, prenumerationer, meddelanden
Hämta meddelanden från en kanal
Lista kanaler som en användare prenumererar på
Kontrollera i logiken att endast prenumeranter får posta meddelanden

En kanal får bara ha en ägare

Tips: Ni kan börja med POST /users, POST /channels, POST /messages osv. och testa era endpoints med t.ex. Postman!

Hur avancerat ni gör API:t bestämmer ni själva – så länge kraven ovan uppfylls. Det är t.ex. inget krav på datavalidering från frontend eller användning av JWT för inloggning.

📡 HTTP-metoder och endpoints
För att uppfylla kraven i uppgiften bör ert API minst stödja följande metoder:

✅ Obligatoriska:
POST – skapa nya resurser
Exempel:

POST /users
POST /channels
POST /subscriptions
POST /messages
GET – hämta resurser
Exempel:

GET /channels/:id/messages
GET /users/:id/channels
🟡 Valfria (för fördjupning eller guldstjärna):
DELETE – ta bort resurser
Exempel:

DELETE /channels/:id
DELETE /subscriptions/:userId/:channelId
PUT eller PATCH – uppdatera resurser
Exempel:

PATCH /messages/:id för att redigera ett meddelande
PATCH /channels/:id för att ändra kanalnamn
💡 Dessa metoder är inte krav för godkänt, men visar på ett mer komplett API och kan vara värdefulla om ni vill utmana er eller nå guldstjärna.

4. 🧪 Testa med Postman
   Testa alla endpoints med Postman
   Kontrollera att rätt saker sparas i databasen
   Spara era anrop (som Postman-samling eller skärmdumpar)
   Bifoga som dokumentation i inlämningen
   Betygskriterier
   För Godkänt:

Har ett komplett ER-diagram med alla entiteter och relationer som täcker in kraven ovan.

API:t fungerar enligt beskrivningen ovan

Bifoga exempelanrop (använd till exempel: Postman) till alla endpoints (se länk under inlämning)

Att alla gruppmedlemmar deltar eller meddelar frånvaro till gruppen senast 12 timmar innan möten, detta gäller för alla grupplanerade möte.

Alla gruppmedlemmar deltar i redovisnings momentet (alla ska prata ungefär lika mycket).

För Guldstjärna:

Ett meddelande kan tillhöra en eller flera kanaler.
Det går att sortera meddelanden på datum.
API, ER-diagram och databasstruktur reflekterar detta
Postman-dokumentation finns även för detta utökade flöde
