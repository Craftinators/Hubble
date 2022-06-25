import cluster from "node:cluster";
import { SnowflakeGenerationOptions } from "../../types";

const epoch: number = 1655942400000;
let increment: number = 0;
let lastSnowflakeId: string = ''

const pad = (number: number, by: number) => number.toString(2).padStart(by, '0');
const getIncrement = (add: number) => pad(increment + add, 12);

/**
 * Generates a new unique Snowflake ID based on twitters id implementation 
 * ```ts
 * const snowflake = SnowflakeUtil.generateSnowflake();
 * console.log(typeof snowflake); // Snowflake
 * ```
 */
export class Snowflake {
    /**
     * The 64 bit integer id represented as a string
     */
    public readonly id: string;

    public constructor(options: SnowflakeGenerationOptions = { generate: true }) {
        if (!options.generate) this.id = '';

        const millisecondsSinceEpoch = pad(new Date().getTime() - epoch, 42);
        const processId = pad(process.pid, 5).slice(0, 5);
        const workerId = pad(cluster.worker?.id ?? 0, 5);
  
        let snowflake = `0b${millisecondsSinceEpoch}${workerId}${processId}${getIncrement(increment)}`;
        if (snowflake === lastSnowflakeId) {
            snowflake = `0b${millisecondsSinceEpoch}${workerId}${processId}${getIncrement(++increment)}`
        } else {
            increment = 0;  
        }

        lastSnowflakeId = snowflake;   
        this.id = BigInt(snowflake).toString();
    }
}