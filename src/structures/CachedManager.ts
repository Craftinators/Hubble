import { IBaseFetchOptions, IBaseMultipleFetchOptions, SnowflakeIdentifier } from "../../types";

export abstract class CachedManager<Identifier extends SnowflakeIdentifier, Value> {
    public readonly cache: Map<Identifier, Value>;

    protected constructor() {
        this.cache = new Map<Identifier, Value>();
    }

    public abstract fetch<Options extends IBaseFetchOptions>(id: Identifier, options?: Options): Promise<Value | null>;
    public abstract fetch<Options extends IBaseMultipleFetchOptions>(options?: Options): Promise<Map<Identifier, Value> | null>;
}