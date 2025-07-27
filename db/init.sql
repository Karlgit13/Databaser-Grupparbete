-- Ta bort befintliga tabeller om de finns
DROP TABLE IF EXISTS message_channels;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS users;

-- Skapa användare
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar(255),
  "created_at" timestamp,
  "content" text NOT NULL
);

-- Skapa kanaler
CREATE TABLE "channels" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(255),
  "owner_id" integer NOT NULL
);

-- Skapa meddelanden
CREATE TABLE "messages" (
  "id" SERIAL PRIMARY KEY,
  "content" text,
  "user_id" integer NOT NULL,
  "created_at" timestamp
);

-- Skapa relationstabell för kanal + meddelande
CREATE TABLE "message_channels" (
  "message_id" integer,
  "channel_id" integer,
  PRIMARY KEY ("message_id", "channel_id")
);

-- Skapa subscriptions
CREATE TABLE "subscriptions" (
  "user_id" integer,
  "channel_id" integer,
  PRIMARY KEY ("user_id", "channel_id")
);

-- Lägg till FK-relationer
ALTER TABLE "channels" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");
ALTER TABLE "messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "message_channels" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");
ALTER TABLE "message_channels" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");
ALTER TABLE "subscriptions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "subscriptions" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");

-- Kommentar för ERD-verktyg
COMMENT ON TABLE "message_channels" IS 'Composite PK = message_id + channel_id';

-- 🔁 ÅTERSTÄLL SEKVENS FÖR SERIAL ID I `messages`
SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1), true);
