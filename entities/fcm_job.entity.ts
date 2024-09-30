import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("fcm_job")
export class FCMJob {
  @PrimaryColumn({ unique: true })
  identifier: string;

  @Column({ type: "timestamp" })
  deliverAt: Date;
}
