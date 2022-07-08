export type SnowflakeIdentifier = string;

export interface IBaseFetchOptions {
    cache: boolean,
    force: boolean,
};

export interface IBaseMultipleFetchOptions extends BaseFetchOptions {
    limit?: number,
    before?: Date,
    after?: Date,
}