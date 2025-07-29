<b>Grupp-Examination-SQL-bulletin<b>
Målet med detta projekt är att bygga ett API och en databas och i detta fall är det prostgreSQL som är databasen.<br>
Vi har även inkluderat pgAdmin för att kunna kontrollera att alla endpoints är korrekta och att det lagras i databasen.<br>
Och som API använder vi då oss av Node.js/Express API.<br>
Funktionaliteten i detta projekt ska vara en sammankoppling mellan API och databas för en anslagstavla<br>
En användare ska t.e.x kunna registrera sig och även prenumerera på kanaler samt skicka meddelanden till kanalen.<br>
En kanal kan endast ha en ägare.<br>
Användare får endast posta på kanaler dom är prenumeranter på<br>
En 

Se ER-diagrammet - Guldstjärneversion på dbdiagram.io:
https://dbdiagram.io/d/687e11fef413ba3508dc530a
<br>
(alternativt i ER-diagram mappen)

----- Instruktioner -----

POST /users - skapar användare <br>
POST /channels - skapar kanal <br>
POST /subscriptions - prenumererar på en kanal <br>
POST /messages - skickar ett medd till en kanal <br>
GET – hämta resurser <br>
GET /channels/:id/messages <br>
GET /users/:id/channels <br>
DELETE – ta bort resurser <br>
DELETE /channels/:id <br>
DELETE /subscriptions/:userId/:channelId <br>
PUT eller PATCH – uppdatera resurser <br>
PATCH /messages/:id för att redigera ett meddelande <br>
PATCH /channels/:id för att ändra kanalnamn <br>

🧪 Testa med Postman <br>
Testa alla endpoints med Postman <br>
Kontrollera att rätt saker sparas i databasen <br>
Spara era anrop (som Postman-samling eller skärmdumpar) <br>
Bifoga som dokumentation i inlämningen <br>

Betygskriterier <br>
För Godkänt: <br>
Har ett komplett ER-diagram med alla entiteter och relationer som täcker in kraven ovan. <br>
API:t fungerar enligt beskrivningen ovan<br>
Bifoga exempelanrop (använd till exempel: Postman) till alla endpoints (se länk under inlämning)<br>
Att alla gruppmedlemmar deltar eller meddelar frånvaro till gruppen senast 12 timmar innan möten, detta gäller för alla grupplanerade möte.<br>
Alla gruppmedlemmar deltar i redovisnings momentet (alla ska prata ungefär lika mycket).

För Guldstjärna:<br>
Ett meddelande kan tillhöra en eller flera kanaler. <br>
Det går att sortera meddelanden på datum. <br>
API, ER-diagram och databasstruktur reflekterar detta <br>
Postman-dokumentation finns även för detta utökade flöde <br>
