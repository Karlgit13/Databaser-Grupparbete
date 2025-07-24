CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" "UNIQUE",
  "created_at" timestamp,
  "content" text NOT NULL
);

CREATE TABLE "channels" (
  "id" integer PRIMARY KEY,
  "name" varchar(255),
  "owner_id" integer NOT NULL
);

CREATE TABLE "messages" (
  "id" integer PRIMARY KEY,
  "content" text,
  "user_id" integer NOT NULL,
  "created_at" timestamp
);

CREATE TABLE "message_channels" (
  "message_id" integer,
  "channel_id" integer,
  "Primary" "Key(message_id,channel_id)"
);

CREATE TABLE "subscriptions" (
  "user_id" integer,
  "channel_id" integer,
  "PRIMARY" "KEY(user_id,channel_id)"
);

COMMENT ON TABLE "message_channels" IS 'Composite PK = message_id + channel_id';

ALTER TABLE "channels" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "message_channels" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");

ALTER TABLE "message_channels" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");

ALTER TABLE "subscriptions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "subscriptions" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");
