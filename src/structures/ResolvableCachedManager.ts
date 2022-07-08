import { SnowflakeIdentifier } from "../../types";
import { CachedManager } from "./CachedManager";

export abstract class ResolvableCachedManager<Identifier extends SnowflakeIdentifier, Resolvable, Value> extends CachedManager<Identifier, Value> {
    protected constructor() { super(); }
    
    public abstract resolve(resolvable: Value): Value;
    public abstract resolve(resolvable: Resolvable): Value | null;

    public abstract resolveId(resolvableId: Value): Identifier;
    public abstract resolveId(resolvableId: Resolvable | Identifier): Identifier | null;
}