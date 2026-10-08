export const parseJson = (source) => JSON.parse(source);

export const sortJsonValue = (value) => {
    if (Array.isArray(value)) return value.map(sortJsonValue);
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.keys(value)
                .sort((first, second) => first.localeCompare(second))
                .map((key) => [key, sortJsonValue(value[key])]),
        );
    }
    return value;
};

export const formatJson = (source, indentation = 2, sortKeys = false) => {
    const value = parseJson(source);
    return JSON.stringify(sortKeys ? sortJsonValue(value) : value, null, indentation);
};

export const minifyJson = (source, sortKeys = false) => {
    const value = parseJson(source);
    return JSON.stringify(sortKeys ? sortJsonValue(value) : value);
};

export const getJsonErrorDetails = (error, source) => {
    const message = error instanceof Error ? error.message : "The JSON could not be parsed.";
    const positionMatch = message.match(/position\s+(\d+)/i);
    const locationMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (!positionMatch && locationMatch) {
        return { message, line: Number(locationMatch[1]), column: Number(locationMatch[2]) };
    }
    if (!positionMatch) return { message, line: null, column: null };

    const position = Math.min(Number(positionMatch[1]), source.length);
    const linesBeforeError = source.slice(0, position).split("\n");
    return {
        message,
        line: linesBeforeError.length,
        column: linesBeforeError[linesBeforeError.length - 1].length + 1,
    };
};
