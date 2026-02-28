alter table "public"."applications" add column "email" text not null;

alter table "public"."applications" add column "phonenumber" text not null;

alter table "public"."applications" alter column "user_id" drop not null;


