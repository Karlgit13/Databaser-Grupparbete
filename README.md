# Grupp-Examination-SQL-bulletin<br>

Målet med detta projekt är att bygga ett API och en databas och i detta fall är det prostgreSQL som är databasen.<br>
Vi har även inkluderat pgAdmin för att kunna kontrollera att alla endpoints är korrekta och att det lagras i databasen<br>
Och som API använder vi då oss av Node.js/Express API.<br>
Funktionaliteten i detta projekt ska vara en sammankoppling mellan API och databas för en anslagstavla<br>
En användare ska t.e.x kunna registrera sig och även prenumerera på kanaler samt skicka meddelanden till kanalen.<br>
En kanal kan endast ha en ägare.<br>
Användare får endast posta på kanaler dom är prenumeranter på<br>
En användare kan endast se meddelanden i de kanaler de är med i<br>
Ett meddelande:<br>
tillhör enbart en kanal
skrivs av exakt en användare<br>
En kanal:<br>
har exakt en ägare<br>
kan innehålla noll eller flera meddelanden<br>

## Se ER-diagrammet - Guldstjärneversion på dbdiagram.io:

https://dbdiagram.io/d/687e11fef413ba3508dc530a
<br>
(alternativt i ER-diagram mappen)<br>

## Förklaringar av rutter.

---- rutter ----<br>
POST /users - Skapar en ny användare<br>
POST /channels - Skapar en ny kanal som en användare äger<br>
POST /subscriptions - Prenumererar en användare på en viss kanal<br>
POST /messages - Skickar ett meddelande till en kanal, om användaren är prenumerant<br>
GET /users - Hämtar alla användare<br>
GET /channels - Hämtar alla kanaler<br>
GET /messages - Hämtar alla meddelanden (oavsett kanal)<br>
GET /resources/overview - Hämtar alla kanaler inkl. deras meddelanden och prenumeranter (översikt)<br>
GET /channels/:id/messages - Hämtar alla meddelanden i en viss kanal<br>
GET /users/:id/channels - Hämtar alla kanaler som en användare är prenumerant på<br>
DELETE /channels/:id - Tar bort en kanal med angivet ID<br>
DELETE /subscriptions/:userId/:channelId - Tar bort en prenumeration (unsubscribe användare från kanal)<br>
DELETE /messages/:id - Tar bort ett enskilt meddelande<br>
PUT eller PATCH – uppdatera resurser <br>
PATCH /messages/:id - Uppdaterar innehållet i ett meddelande<br>
PATCH /channels/:id - Uppdaterar kanalens namn<br>

## Instruktioner för att starta

git clone / download zip<br>
npm install<br>
npm run dev<br>
(script lagts till att starta både backed och postgreSQL 17)<br>
(OBS krävs postgreSQL 17 installerat på datorn.)
