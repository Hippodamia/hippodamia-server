/*
export class User extends BaseEntity {
    id: number;
    qqId: string;
    nick: string | null;
    prefix: string | null;
    suffix: string | null;
    coins: bigint;
    rankings: RaceRanking[];
    random_event_records: RandomEventRecord[];
    buff_records: BuffRecord[];
}


export class RaceRecord extends BaseEntity {
    id: number;
    channel: string;
    time: Date;
    rank: RaceRanking[];
    mode: string;
}


export class RaceRanking extends BaseEntity {
    id: number;
    rank: number;
    user: User;
    race: RaceRecord;
    raceId: number;
}


export class RandomEventRecord extends BaseEntity {

    id: number;
    event_name: string;
    user: User;
}
export class BuffRecord extends BaseEntity {

    id: number;
    buff_name: string;
    buff_type: number;
    user: User;
}
*/
