export function undefinedToNull<T>(obj: T | undefined): T | null {
    if (obj === undefined) {
        return null;
    }
    return obj;
}

export function nullToUndefined<T>(obj: T | undefined | null): T | undefined {
    if (obj === null) {
        return undefined;
    }
    return obj;
}
