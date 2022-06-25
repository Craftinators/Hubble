import assert from 'node:assert';
import { Snowflake } from '../src/identification/Snowflake';

describe('Snowflake', function() {
    it('Creating 5000 snowflakes shouldn\'t yeild duplicates', function() {
        const array: Array<string> = [];
        for (let i = 0; i < 5000; i++) array.push(new Snowflake().id);

        const set: Set<string> = new Set(array);
        assert.equal(array.length, set.size);
    });
});