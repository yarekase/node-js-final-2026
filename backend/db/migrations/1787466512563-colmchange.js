/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Colmchange1787466512563 {
    name = 'Colmchange1787466512563'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKINGS" DROP COLUMN "credit_used"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" DROP COLUMN "purchase_credits"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" DROP COLUMN "price_paid"`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" ADD "price_paid" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASES" ADD "purchase_credits" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKINGS" ADD "credit_used" integer NOT NULL`);
    }
}
