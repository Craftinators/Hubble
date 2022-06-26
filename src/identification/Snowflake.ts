import cluster from "node:cluster";

const epoch: number = 1655942400000;
let increment: number = 0;
let lastSnowflakeId: string = ''

/**
 * Converts a number to binary and adds a specified number of zeros in front of it.
 * @param number The number to convert into binary.
 * @param by Specifies the amount of zeros to add to the front of the number.
 * @returns A binary number padded with a specific number of zeros in front of it.
 */
const pad = (number: number, by: number): string => number.toString(2).padStart(by, '0');

/**
 * Adds to the incremental value that handles multiple {@link Snowflake} objects created 
 * in the same millisecond by a specified amount and pads it with 12 zeros.
 * @param add The amount to add to the current increment.
 * @returns The incremented and padded value.
 */
const getIncrement = (add: number): string => pad(increment + add, 12);

/**
 * Generates a new unique Snowflake ID based on twitters id implementation.
 */
export class Snowflake {
    /**
     * The 64 bit integer id represented as a string.
     */
    public readonly id: string;

    /**
     * The timestamp when this snowflake was created.
     */
    public readonly createdTimestamp: number;

    /**
     * The id of the NodeJS process used to create this snowflake
     */
    public readonly pid: number;

    /**
     * The id of the cluster worker used to create this snowflake
     */
    public readonly wid: number;

    public constructor() {
        this.createdTimestamp = new Date().getTime();
        this.pid = process.pid
        this.wid = cluster.worker?.id ?? 0;

        const millisecondsSinceEpoch = pad(this.createdTimestamp - epoch, 42);
        const processId = pad(this.pid, 5).slice(0, 5);
        const workerId = pad(this.wid, 5);
  
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