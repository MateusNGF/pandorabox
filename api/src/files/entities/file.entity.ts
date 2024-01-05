
import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  @Unique(['code', 'filename'])
  export class File extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false, type: 'varchar', length: 200 })
    code: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    filename : string
  
    @Column({ nullable: false, name: 'origin_ip', type: 'varchar', length: 200 })
    originIp: string;
  
    @Column({ type: 'boolean', default: true })
    public: boolean;

    @CreateDateColumn({ name : "created_at" })
    createdAt: Date;
  
    @UpdateDateColumn({ name : "updated_at" })
    updatedAt: Date;
  }