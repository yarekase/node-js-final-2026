/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Courserelationskillmanytoone1787322773611 {
    name = 'Courserelationskillmanytoone1787322773611'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "FK_e4c9d442af9b7e830f2b642a487"`);
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "REL_e4c9d442af9b7e830f2b642a48"`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "FK_e4c9d442af9b7e830f2b642a487" FOREIGN KEY ("skill_id") REFERENCES "SKILLS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSES" DROP CONSTRAINT "FK_e4c9d442af9b7e830f2b642a487"`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "REL_e4c9d442af9b7e830f2b642a48" UNIQUE ("skill_id")`);
        await queryRunner.query(`ALTER TABLE "COURSES" ADD CONSTRAINT "FK_e4c9d442af9b7e830f2b642a487" FOREIGN KEY ("skill_id") REFERENCES "SKILLS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
