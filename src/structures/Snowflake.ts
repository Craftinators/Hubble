import cluster from "node:cluster";
import { SnowflakeIdentifier } from "../../types";

const epoch: number = 1655942400000;
let increment: number = 0;
let cache: Set<string> = new Set();

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

export class Snowflake {
    private constructor() { }

    /**
     * Generates a new unique Snowflake ID based on twitters id implementation.
     */
    public static generate(): SnowflakeIdentifier {
        const millisecondsSinceEpoch = pad(new Date().getTime() - epoch, 42);
        const processId = pad(process.pid, 5).slice(0, 5);
        const workerId = pad(cluster.worker?.id ?? 0, 5);
  
        let snowflake = `0b${millisecondsSinceEpoch}${workerId}${processId}${getIncrement(increment)}`;
        while(cache.has(snowflake)) {
            snowflake = `0b${millisecondsSinceEpoch}${workerId}${processId}${getIncrement(++increment)}`
        }
        cache.add(snowflake); 

        increment = 0;
        
        return BigInt(snowflake).toString() as SnowflakeIdentifier;
    }
}