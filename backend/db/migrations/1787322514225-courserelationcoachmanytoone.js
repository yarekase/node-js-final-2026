/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Courserelationcoachmanytoone1787322514225 {
    name = 'Courserelationcoachmanytoone1787322514225'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "FK_9d05d5df6b21424ed5eab565aab"`);
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "REL_9d05d5df6b21424ed5eab565aa"`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "FK_9d05d5df6b21424ed5eab565aab" FOREIGN KEY ("coach_id") REFERENCES "COACHES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "FK_9d05d5df6b21424ed5eab565aab"`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "REL_9d05d5df6b21424ed5eab565aa" UNIQUE ("coach_id")`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "FK_9d05d5df6b21424ed5eab565aab" FOREIGN KEY ("coach_id") REFERENCES "COACHES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
