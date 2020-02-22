export function wither<T>(obj: T): (value: { [key in keyof T]: T[key] }) => T {
    return (value) => {
        return {
            ...obj,
            ...value,
        }
    }
}