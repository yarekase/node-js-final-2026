/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddonDelete1787468363780 {
    name = 'AddonDelete1787468363780'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" DROP CONSTRAINT "FK_39aa6d9228696026caa7ac10fcd"`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" DROP CONSTRAINT "FK_7a1fdcbb98cbde66a7ca4b57cf5"`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" ADD CONSTRAINT "FK_39aa6d9228696026caa7ac10fcd" FOREIGN KEY ("coach_id") REFERENCES "COACHES"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" ADD CONSTRAINT "FK_7a1fdcbb98cbde66a7ca4b57cf5" FOREIGN KEY ("skill_id") REFERENCES "SKILLS"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" DROP CONSTRAINT "FK_7a1fdcbb98cbde66a7ca4b57cf5"`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" DROP CONSTRAINT "FK_39aa6d9228696026caa7ac10fcd"`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" ADD CONSTRAINT "FK_7a1fdcbb98cbde66a7ca4b57cf5" FOREIGN KEY ("skill_id") REFERENCES "SKILLS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACHS_LINK_SKILLS" ADD CONSTRAINT "FK_39aa6d9228696026caa7ac10fcd" FOREIGN KEY ("coach_id") REFERENCES "COACHES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
