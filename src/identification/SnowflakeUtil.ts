import cluster from "node:cluster";
import { Snowflake } from "../../types/index";

const epoch: number = 1655942400000;
let increment: number = 0;
let lastSnowflake: Snowflake = '';

export class SnowflakeUtil {
    private constructor() { }

    public static generateSnowflake(): Snowflake {
        const pad = (number: number, by: number) => number.toString(2).padStart(by, '0');

        const millisecondsSinceEpoch = pad(new Date().getTime() - epoch, 42);
        const processId = pad(process.pid, 5).slice(0, 5);
        const workerId = pad(cluster.worker?.id ?? 0, 5);
        const getIncrement = (add: number) => pad(increment + add, 12);
  
        let snowflake = `0b${millisecondsSinceEpoch}${workerId}${processId}${getIncrement(increment)}`;
        if (snowflake === lastSnowflake) {
            snowflake = `0b${millisecondsSinceEpoch}${workerId}${processId}${getIncrement(++increment)}`
        } else {
            increment = 0;  
        }

        lastSnowflake = snowflake;   
        return BigInt(snowflake).toString();
    }
}