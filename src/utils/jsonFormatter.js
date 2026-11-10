export const parseJson = (source) => JSON.parse(source);

const parseLosslessJson = (source) => {
    let index = 0;
    const fail = () => { throw new SyntaxError(`Unexpected token at position ${index}`); };
    const skipWhitespace = () => {
        while (source[index] === " " || source[index] === "\t" || source[index] === "\n" || source[index] === "\r") {
            index += 1;
        }
    };
    const parseString = () => {
        const start = index;
        index += 1;
        while (index < source.length) {
            if (source[index] === "\\") {
                index += 2;
            } else if (source[index] === '"') {
                index += 1;
                return JSON.parse(source.slice(start, index));
            } else {
                index += 1;
            }
        }
        fail();
    };
    const parseValue = () => {
        skipWhitespace();
        const character = source[index];

        if (character === '"') return { type: "string", value: parseString() };
        if (character === "{") {
            index += 1;
            skipWhitespace();
            const entries = [];
            if (source[index] === "}") {
                index += 1;
                return { type: "object", entries };
            }
            while (index < source.length) {
                skipWhitespace();
                if (source[index] !== '"') fail();
                const key = parseString();
                skipWhitespace();
                if (source[index] !== ":") fail();
                index += 1;
                entries.push([key, parseValue()]);
                skipWhitespace();
                if (source[index] === "}") {
                    index += 1;
                    return { type: "object", entries };
                }
                if (source[index] !== ",") fail();
                index += 1;
            }
            fail();
        }
        if (character === "[") {
            index += 1;
            skipWhitespace();
            const items = [];
            if (source[index] === "]") {
                index += 1;
                return { type: "array", items };
            }
            while (index < source.length) {
                items.push(parseValue());
                skipWhitespace();
                if (source[index] === "]") {
                    index += 1;
                    return { type: "array", items };
                }
                if (source[index] !== ",") fail();
                index += 1;
            }
            fail();
        }
        if (source.startsWith("true", index)) {
            index += 4;
            return { type: "literal", value: "true" };
        }
        if (source.startsWith("false", index)) {
            index += 5;
            return { type: "literal", value: "false" };
        }
        if (source.startsWith("null", index)) {
            index += 4;
            return { type: "literal", value: "null" };
        }

        const number = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(source.slice(index));
        if (number) {
            index += number[0].length;
            return { type: "number", value: number[0] };
        }
        fail();
    };

    try {
        const value = parseValue();
        skipWhitespace();
        if (index !== source.length) fail();
        return value;
    } catch (error) {
        // Keep the browser's native JSON.parse error text and position when the input is invalid.
        parseJson(source);
        throw error;
    }
};

const stringifyLosslessJson = (node, indentation, sortKeys, depth = 0) => {
    if (node.type === "string") return JSON.stringify(node.value);
    if (node.type === "number" || node.type === "literal") return node.value;

    const spacing = " ".repeat(indentation);
    const newline = indentation ? "\n" : "";
    const childIndentation = indentation ? spacing.repeat(depth + 1) : "";
    const closingIndentation = indentation ? spacing.repeat(depth) : "";

    if (node.type === "array") {
        if (!node.items.length) return "[]";
        const values = node.items.map((item) => stringifyLosslessJson(item, indentation, sortKeys, depth + 1));
        return `[${newline}${childIndentation}${values.join(`,${newline}${childIndentation}`)}${newline}${closingIndentation}]`;
    }

    const entries = sortKeys
        ? [...node.entries].sort(([first], [second]) => first.localeCompare(second))
        : node.entries;
    if (!entries.length) return "{}";
    const values = entries.map(([key, value]) =>
        `${JSON.stringify(key)}${indentation ? ": " : ":"}${stringifyLosslessJson(value, indentation, sortKeys, depth + 1)}`,
    );
    return `{${newline}${childIndentation}${values.join(`,${newline}${childIndentation}`)}${newline}${closingIndentation}}`;
};

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
    return stringifyLosslessJson(parseLosslessJson(source), indentation, sortKeys);
};

export const minifyJson = (source, sortKeys = false) => {
    return stringifyLosslessJson(parseLosslessJson(source), 0, sortKeys);
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
