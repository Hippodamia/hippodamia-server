import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    qqId: string ;

    @Column({ nullable: true })
    nick: string | null;

    @Column({ nullable: true })
    prefix: string | null;

    @Column({ nullable: true })
    suffix: string | null;

    @Column({ default: 500, type: 'bigint' })
    coins: bigint;

    @OneToMany(() => RaceRanking, (raceRanking) => raceRanking.user)
    rankings: RaceRanking[];


    @OneToMany(() => RandomEventRecord, (randomEventRec) => randomEventRec.user)
    random_event_records: RandomEventRecord[];

    @OneToMany(() => BuffRecord, (buffRecord) => buffRecord.user)
    buff_records: BuffRecord[];
}

@Entity('race_record')
export class RaceRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    channel: string;

    @Column()
    time: Date;

    @OneToMany(() => RaceRanking, (raceRanking) => raceRanking.race)
    rank: RaceRanking[];

    @Column()
    mode: string;
}

@Entity({ name: 'race_ranking' })
export class RaceRanking extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rank: number;

    @ManyToOne(() => User, (user) => user.rankings)
    user: User;

    @ManyToOne(() => RaceRecord, (raceRecord) => raceRecord.rank)
    race: RaceRecord;

    @Column()
    raceId: number;
}

@Entity({ name: 'random_event_record' })
export class RandomEventRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_name: string;

    @ManyToOne(() => User, (user) => user.random_event_records)
    user: User;
}

@Entity({ name: 'buff_record' })
export class BuffRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    buff_name: string;

    @Column()
    buff_type: number;

    @ManyToOne(() => User, (user) => user.buff_records)
    user: User;
}