/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1786868394327 {
    name = 'Init1786868394327'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "CREDIT_PACKAGES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "credit_amount" integer NOT NULL, "price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b0f9210cbf34e80629197316e1f" UNIQUE ("name"), CONSTRAINT "PK_30c428daf2d680c95eb3dd95af0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SKILLS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4834833d62b3d8a04ff8b6be984" UNIQUE ("name"), CONSTRAINT "PK_3e5ba8fc2ab5d996f932af9027c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COACHES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "experience_years" integer NOT NULL DEFAULT '0', "description" text, "profile_image_url" character varying(2048), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1f1cd77afea4a66fcc03a4bdba9" UNIQUE ("user_id"), CONSTRAINT "REL_1f1cd77afea4a66fcc03a4bdba" UNIQUE ("user_id"), CONSTRAINT "PK_3816cdc4d01f1070d5ab8e678ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "USERS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'USER', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a1689164dbbcca860ce6d17b2e1" UNIQUE ("email"), CONSTRAINT "PK_b16c39a00c89083529c6166fa5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COURSES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coach_id" uuid NOT NULL, "skill_id" uuid NOT NULL, "name" character varying(50) NOT NULL, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "max_participants" integer NOT NULL, CONSTRAINT "UQ_4a130ede571cea14cdd9699374a" UNIQUE ("name"), CONSTRAINT "REL_9d05d5df6b21424ed5eab565aa" UNIQUE ("coach_id"), CONSTRAINT "REL_e4c9d442af9b7e830f2b642a48" UNIQUE ("skill_id"), CONSTRAINT "PK_27fddb82290e2c8378be8159ef8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COURSE_BOOKINGS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "credit_used" integer NOT NULL, "cancelled_at" TIMESTAMP, CONSTRAINT "PK_1af4186c17ce28057f19df7e5c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CREDIT_PURCHASES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "credit_package_id" uuid NOT NULL, "purchase_credits" integer NOT NULL, "price_paid" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c4af677883406bde41522e37882" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COACHS_LINK_SKILLS" ("coach_id" uuid NOT NULL, "skill_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d700861e9fad1a2571baf3a8d72" PRIMARY KEY ("coach_id", "skill_id"))`);
        await queryRunner.query(`ALTER TABLE "COACHES" ADD CONSTRAINT "FK_1f1cd77afea4a66fcc03a4bdba9" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "FK_9d05d5df6b21424ed5eab565aab" FOREIGN KEY ("coach_id") REFERENCES "COACHES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "FK_e4c9d442af9b7e830f2b642a487" FOREIGN KEY ("skill_id") REFERENCES "SKILLS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKINGS" ADD CONSTRAINT "FK_688a88e55579d391c3ebedd391c" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKINGS" ADD CONSTRAINT "FK_5e39fbe7e041536776c2989d253" FOREIGN KEY ("course_id") REFERENCES "COURSES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" ADD CONSTRAINT "FK_0876cee1c85f2337a6763f7ff0f" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" ADD CONSTRAINT "FK_e4823f22bd79f1fb61b32e74552" FOREIGN KEY ("credit_package_id") REFERENCES "CREDIT_PACKAGES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" ADD CONSTRAINT "FK_39aa6d9228696026caa7ac10fcd" FOREIGN KEY ("coach_id") REFERENCES "COACHES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" ADD CONSTRAINT "FK_7a1fdcbb98cbde66a7ca4b57cf5" FOREIGN KEY ("skill_id") REFERENCES "SKILLS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" DROP CONSTRAINT "FK_7a1fdcbb98cbde66a7ca4b57cf5"`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" DROP CONSTRAINT "FK_39aa6d9228696026caa7ac10fcd"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" DROP CONSTRAINT "FK_e4823f22bd79f1fb61b32e74552"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" DROP CONSTRAINT "FK_0876cee1c85f2337a6763f7ff0f"`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKINGS" DROP CONSTRAINT "FK_5e39fbe7e041536776c2989d253"`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKINGS" DROP CONSTRAINT "FK_688a88e55579d391c3ebedd391c"`);
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "FK_e4c9d442af9b7e830f2b642a487"`);
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "FK_9d05d5df6b21424ed5eab565aab"`);
        await queryRunner.query(`ALTER TABLE "COACHES" DROP CONSTRAINT "FK_1f1cd77afea4a66fcc03a4bdba9"`);
        await queryRunner.query(`DROP TABLE "COACHS_LINK_SKILLS"`);
        await queryRunner.query(`DROP TABLE "CREDIT_PURCHASES"`);
        await queryRunner.query(`DROP TABLE "COURSE_BOOKINGS"`);
        await queryRunner.query(`DROP TABLE "COURSES"`);
        await queryRunner.query(`DROP TABLE "USERS"`);
        await queryRunner.query(`DROP TABLE "COACHES"`);
        await queryRunner.query(`DROP TABLE "SKILLS"`);
        await queryRunner.query(`DROP TABLE "CREDIT_PACKAGES"`);
    }
}
