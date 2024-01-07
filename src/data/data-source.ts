import {DataSource} from "typeorm";
import {BuffRecord, RaceRanking, RaceRecord, RandomEventRecord, User} from "./entity";
import path from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.resolve('./config/dev.sqlite'),
    synchronize: true,
    entities: [User, RaceRanking,RaceRecord,RandomEventRecord,BuffRecord],
})

AppDataSource.initialize()
