Se ER-diagrammet - Guldstjärneversion på dbdiagram.io: https://dbdiagram.io/d/687e11fef413ba3508dc530a (alternativt i ER-diagram mappen)

----- Instruktioner -----

POST /users
POST /channels
POST /subscriptions
POST /messages
GET – hämta resurser
GET /channels/:id/messages
GET /users/:id/channels
DELETE – ta bort resurser
DELETE /channels/:id
DELETE /subscriptions/:userId/:channelId
PUT eller PATCH – uppdatera resurser
PATCH /messages/:id för att redigera ett meddelande
PATCH /channels/:id för att ändra kanalnamn

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
