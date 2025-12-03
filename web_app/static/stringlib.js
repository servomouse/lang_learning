

/**
 * Replaces substrings in the first string that are surrounded by double underscores with a specified replacement string.
 * 
 * The function maintains the case of the first letter of the original substring. 
 * If the first letter of the substring is uppercase, the first letter of the replacement string 
 * will also be capitalized in the resulting string.
 *
 * @param {string} str - The string containing substrings surrounded by double underscores to be replaced.
 * @param {string} replacement - The string to replace the matched substrings with.
 * @returns {string} The modified string with replacements made.
 *
 * @example
 * myreplace("Hello __world!__", "beer!");    // Returns "Hello beer!"
 * myreplace("Hello __World!__", "beer!");    // Returns "Hello Beer!"
 */
export function myreplace(str, replacement) {
    return str.replace(/__(.*?)__/g, (match, p1) => {
        // Check if the first letter of p1 is uppercase
        if (p1.length > 0 && p1[0].toUpperCase() === p1[0]) {
            // Capitalize the first letter of the replacement if needed
            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        // Return the replacement string
        return replacement;
    });
}

/**
 * Extracts a substring enclosed by double underscores from the given string.
 * 
 * Assumes there is exactly one such substring. If no such substring is found,
 * the function returns an empty string.
 *
 * @param {string} str - The input string containing a substring surrounded by double underscores.
 * @returns {string} The extracted substring without the surrounding underscores.
 *
 * @example
 * extractSubstring("__world!__"); // Returns "world!"
 * extractSubstring("Hello __World!__"); // Returns "World!"
 * extractSubstring("No underscores here"); // Returns ""
 */
export function extractSubstring(str) {
    const match = str.match(/__(.*?)__/);
    return match ? match[1] : '';
}
