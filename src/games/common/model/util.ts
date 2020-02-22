export class Wither<T> {
    with = (p: Partial<T>): T => {
        return {
            ...(this as unknown as T),
            ...p,
        }
    }
}