

export function capitalize(string: string|undefined|null) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}