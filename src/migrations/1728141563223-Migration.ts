import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728141563223 implements MigrationInterface {
    name = 'Migration1728141563223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contact_type_enum" AS ENUM('TELEGRAM', 'INSTAGRAM', 'DISCORD', 'VK')`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying, "nickname" character varying NOT NULL, "type" "public"."contact_type_enum" NOT NULL, "profileId" uuid, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "about" character varying, "logo" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "recommendationId" uuid, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "recommendationId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recommendation_type_enum" AS ENUM('MOVIE', 'MUSIC', 'ANIME', 'BOOK', 'HOBBY', 'TODO', 'SERIES')`);
        await queryRunner.query(`CREATE TABLE "recommendation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "favoritesCount" integer NOT NULL DEFAULT '0', "type" "public"."recommendation_type_enum" NOT NULL, "link" character varying, "authorId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_17cb51984a6627ef2ce7370e23c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "profileId" uuid NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favorites_recommendation" ("userId" uuid NOT NULL, "recommendationId" uuid NOT NULL, CONSTRAINT "PK_c73d0ab5d5547379ea514c54087" PRIMARY KEY ("userId", "recommendationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d89b4e6bddd33960be2e80628" ON "user_favorites_recommendation" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1608cb29ae24f0a2ebd564d550" ON "user_favorites_recommendation" ("recommendationId") `);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_4f6cb2839eaa6453371c22e3809" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_43bce71e833ee3acd427a134dbf" FOREIGN KEY ("recommendationId") REFERENCES "recommendation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8eea6558a58a57b7e73a18287a2" FOREIGN KEY ("recommendationId") REFERENCES "recommendation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recommendation" ADD CONSTRAINT "FK_bf6e8a4dc351deec7f1fc9cc1a8" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorites_recommendation" ADD CONSTRAINT "FK_0d89b4e6bddd33960be2e80628d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites_recommendation" ADD CONSTRAINT "FK_1608cb29ae24f0a2ebd564d550b" FOREIGN KEY ("recommendationId") REFERENCES "recommendation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_recommendation" DROP CONSTRAINT "FK_1608cb29ae24f0a2ebd564d550b"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_recommendation" DROP CONSTRAINT "FK_0d89b4e6bddd33960be2e80628d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "recommendation" DROP CONSTRAINT "FK_bf6e8a4dc351deec7f1fc9cc1a8"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8eea6558a58a57b7e73a18287a2"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_43bce71e833ee3acd427a134dbf"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_4f6cb2839eaa6453371c22e3809"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1608cb29ae24f0a2ebd564d550"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d89b4e6bddd33960be2e80628"`);
        await queryRunner.query(`DROP TABLE "user_favorites_recommendation"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "recommendation"`);
        await queryRunner.query(`DROP TYPE "public"."recommendation_type_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TYPE "public"."contact_type_enum"`);
    }

}
