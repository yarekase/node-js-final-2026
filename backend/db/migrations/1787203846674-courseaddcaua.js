/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Courseaddcaua1787203846674 {
    name = 'Courseaddcaua1787203846674'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSES" ADD "create_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD "update_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSES" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "COURSES" DROP COLUMN "create_at"`);
    }
}
