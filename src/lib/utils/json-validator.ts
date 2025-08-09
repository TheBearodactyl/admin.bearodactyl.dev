export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

export function validateJsonWithDetails(
  jsonString: string
): JsonValidationResult {
  if (!jsonString.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = error.message;

      const positionMatch = message.match(/position (\d+)/);
      const lineMatch = message.match(/line (\d+)/);
      const columnMatch = message.match(/column (\d+)/);

      let line: number | undefined;
      let column: number | undefined;

      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        const lines = jsonString.substring(0, position).split("\n");
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      } else if (lineMatch && columnMatch) {
        line = parseInt(lineMatch[1], 10);
        column = parseInt(columnMatch[1], 10);
      }

      let suggestion: string | undefined;
      if (message.includes("Unexpected token")) {
        if (message.includes("Unexpected token }")) {
          suggestion = "Extra closing brace. Check for missing comma or quote.";
        } else if (message.includes("Unexpected token ]")) {
          suggestion = "Extra closing bracket. Check array structure.";
        } else if (message.includes("Unexpected token ,")) {
          suggestion = "Trailing comma or missing value before comma.";
        }
      } else if (message.includes("Unterminated string")) {
        suggestion = "Missing closing quote for string value.";
      } else if (message.includes("Expected property name")) {
        suggestion = "Property names must be enclosed in double quotes.";
      }

      return {
        isValid: false,
        error: message,
        line,
        column,
        suggestion,
      };
    }

    return {
      isValid: false,
      error:
        error instanceof Error ? error.message : "Unknown JSON parsing error",
    };
  }
}

export function formatJsonSafely(
  jsonString: string,
  indent: number = 2
): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indent);
  } catch {
    return jsonString;
  }
}

export function minifyJsonSafely(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch {
    return jsonString;
  }
}
