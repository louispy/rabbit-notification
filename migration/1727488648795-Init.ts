import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1727488648795 implements MigrationInterface {
    name = 'Init1727488648795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`fcm_job\` (\`identifier\` varchar(255) NOT NULL, \`deliverAt\` timestamp NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`fcm_job\``);
    }

}
