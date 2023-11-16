export function undefinedToNull<T>(obj: T | undefined): T | null {
    if (obj === undefined) {
        return null;
    }
    return obj;
}