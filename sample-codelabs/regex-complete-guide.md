---
id: regex-complete-crash-course
summary: A comprehensive 20-minute crash course covering all essential regex concepts
authors: Kamil Hassan
categories: regex, programming, tutorial
environments: Web
status: Published
duration: 22
home url: /codelab-tools/
feedback link: https://github.com/Bit-Blazer/regex-codelab/issues/new
---

# Regular Expressions: Complete Crash Course

## Introduction

Duration: 2:00

### What is Regex?

Regular Expressions (regex) are patterns used to match character combinations in strings.

**Use cases:**

- Validation (email, phone, password)
- Search and replace
- Text parsing and extraction
- Log analysis
- Data cleaning

**Testing tools:** [regex101.com](https://regex101.com), [regexr.com](https://regexr.com)

### Using Regex in JavaScript

**Creating patterns:**

```javascript
const regex1 = /pattern/flags;           // Literal notation
const regex2 = new RegExp('pattern', 'flags');  // Constructor
```

**Key methods:**

- **`test()`** - Returns true/false if pattern matches

  ```javascript
  /\d+/.test("abc123"); // true
  ```

- **`exec()`** - Returns match details or null

  ```javascript
  /\d+/.exec("abc123"); // ['123', index: 3, ...]
  ```

- **`replace()`** - Find and replace

  ```javascript
  "hello".replace(/l/g, "L"); // 'heLLo'
  ```

- **`search()`** - Returns index of first match

  ```javascript
  "abc123".search(/\d/); // 3
  ```

- **`split()`** - Split string by pattern

  ```javascript
  "a1b2c3".split(/\d/); // ['a', 'b', 'c', '']
  ```

### Using Regex in Python

**Creating patterns:**

```python
import re
pattern = re.compile(r'pattern', flags)  # Compiled (recommended)
# Or use directly in functions
```

**Key methods:**

- **`re.search()`** - Find first match anywhere

  ```python
  re.search(r'\d+', 'abc123')  # Match object
  ```

- **`re.match()`** - Match from beginning only

  ```python
  re.match(r'\d+', '123abc')  # Match object
  ```

- **`re.fullmatch()`** - Match entire string

  ```python
  re.fullmatch(r'\d+', '123')  # Match object
  ```

- **`re.findall()`** - Return list of all matches

  ```python
  re.findall(r'\d+', 'a1b2c3')  # ['1', '2', '3']
  ```

- **`re.finditer()`** - Iterator of match objects

  ```python
  for m in re.finditer(r'\d+', 'a1b2'):
      print(m.group())
  ```

- **`re.sub()`** - Find and replace

  ```python
  re.sub(r'\d', '#', 'a1b2')  # 'a#b#'
  ```

- **`re.split()`** - Split by pattern

  ```python
  re.split(r'\d', 'a1b2c')  # ['a', 'b', 'c']
  ```

**Match object methods:**

- `group()` - Get matched text
- `start()`, `end()` - Get match positions
- `groups()` - Get all captured groups

---

## Fundamentals & Literal Matching

Duration: 1:00

### Literal Characters

`hello` matches "hello" exactly

### Special Characters (Metacharacters)

These characters have special meaning in regex. To match them literally, escape with `\`:

**`.` (dot)** - Matches any single character except newline

- `a.c` matches "abc", "a1c", "a#c"

**`*` (asterisk)** - Matches 0 or more of the preceding element

- `ab*c` matches "ac", "abc", "abbbbc"

**`+` (plus)** - Matches 1 or more of the preceding element

- `ab+c` matches "abc", "abbc" (but NOT "ac")

**`?` (question mark)** - Matches 0 or 1 of the preceding element (optional)

- `colou?r` matches "color" or "colour"

**`[ ]` (square brackets)** - Defines a character class (match any one character inside)

- `[abc]` matches "a", "b", or "c"
- `[a-z]` matches any lowercase letter

**`{ }` (curly braces)** - Specifies exact quantity

- `\d{3}` matches exactly 3 digits
- `\d{2,4}` matches 2 to 4 digits

**`( )` (parentheses)** - Groups patterns and captures them

- `(ab)+` matches "ab", "abab", "ababab"
- Captures the match for later use

**`^` (caret)** - Matches the start of a line/string

- `^hello` only matches "hello" at the beginning

**`$` (dollar)** - Matches the end of a line/string

- `world$` only matches "world" at the end

**`|` (pipe)** - OR operator (alternation)

- `cat|dog` matches "cat" or "dog"

**`\` (backslash)** - Escapes special characters or creates special sequences

- `\.` matches a literal period
- `\d` matches any digit
- `\w` matches word characters
- `\$` matches a dollar sign
- `\(` matches opening parenthesis
- `\*` matches an asterisk

---

## Character Classes

Duration: 2:00

### Predefined Classes

| Pattern | Matches                                          | Opposite              |
| ------- | ------------------------------------------------ | --------------------- |
| `\d`    | Any digit `[0-9]`                                | `\D` (non-digit)      |
| `\w`    | Word char `[a-zA-Z0-9_]`                         | `\W` (non-word)       |
| `\s`    | Whitespace (space, tab, newline) `[\t \n\v\f\r]` | `\S` (non-whitespace) |
| `.`     | Any character (except newline) `[^\n]`           | N/A                   |

### Custom Character Classes

- `[abc]` - matches a, b, or c
- `[a-z]` - matches any lowercase letter
- `[0-9]` - matches any digit
- `[a-zA-Z0-9]` - alphanumeric
- `[^abc]` - matches anything EXCEPT a, b, or c (negation)

**Examples:**

- `[aeiou]` - vowels
- `[^aeiou]` - consonants
- `[0-9a-fA-F]` - hexadecimal digits

---

## Quantifiers

Duration: 2:00

### Basic Quantifiers

| Quantifier | Meaning                    | Example                               |
| ---------- | -------------------------- | ------------------------------------- |
| `*`        | 0 or more `{0, }`          | `a*` matches "", "a", "aaa"           |
| `+`        | 1 or more `{1, }`          | `a+` matches "a", "aaa" (not "")      |
| `?`        | 0 or 1 (optional) `{0, 1}` | `colou?r` matches "color" or "colour" |
| `{n}`      | Exactly n                  | `\d{3}` matches "123"                 |
| `{n,}`     | n or more                  | `\d{2,}` matches "12", "123", "1234"  |
| `{n,m}`    | Between n and m            | `\d{2,4}` matches "12", "123", "1234" |

### Greedy vs Lazy

- **Greedy** (default): Match as much as possible
  - `.*` in "abc123xyz" matches entire string
- **Lazy** (add `?`): Match as little as possible
  - `.*?` matches smallest possible

---

## Anchors & Boundaries

Duration: 1:30

### Position Anchors

| Anchor | Matches                    |
| ------ | -------------------------- |
| `^`    | Start of line/string       |
| `$`    | End of line/string         |
| `\A`   | Start of string (absolute) |
| `\Z`   | End of string (absolute)   |
| `\b`   | Word boundary              |
| `\B`   | Non-word boundary          |

**Examples:**

- `^hello` - "hello" at start
- `world$` - "world" at end
- `^hello world$` - exact match entire line
- `\bcat\b` - "cat" as whole word (not in "category")

---

## Groups & Capturing

Duration: 2:00

### Capturing Groups

`(pattern)` - Captures matched text for later use

**Example:** `(\d{3})-(\d{4})` in "555-1234"

- Group 1: "555"
- Group 2: "1234"

### Non-Capturing Groups

`(?:pattern)` - Groups without capturing (better performance)

**Example:** `(?:http|https)://` - matches protocol without capturing

### Named Groups

`(?<name>pattern)` or `(?P<name>pattern)` (Python)

**Example:** `(?<area>\d{3})-(?<number>\d{4})`

**Practical Example - Name Conversion:**

Convert "John Doe" to "Doe, John":

**JavaScript:**

```javascript
const name = "John Doe";
const result = name.replace(/(?<first>\w+)\s(?<last>\w+)/, "$<last>, $<first>");
// Result: "Doe, John"
```

**Python:**

```python
import re
name = "John Doe"
result = re.sub(r'(?P<first>\w+)\s(?P<last>\w+)', r'\g<last>, \g<first>', name)
# Result: "Doe, John"
```

**Date Format Conversion:**

Convert "25-12-2024" (DD-MM-YYYY) to "2024-12-25" (YYYY-MM-DD):

**JavaScript:**

```javascript
const date = "25-12-2024";
const result = date.replace(
  /(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})/,
  "$<year>-$<month>-$<day>"
);
// Result: "2024-12-25"
```

**Python:**

```python
import re
date = "25-12-2024"
result = re.sub(r'(?P<day>\d{2})-(?P<month>\d{2})-(?P<year>\d{4})', r'\g<year>-\g<month>-\g<day>', date)
# Result: "2024-12-25"
```

### Backreferences

Reference captured groups:

- `\1`, `\2`, `\3` - by number
- `\k<name>` - by name

**Example 1: Find Repeated Words**

`(\w+)\s\1` matches repeated words like "hello hello"

```javascript
// JavaScript
"hello hello world".match(/(\w+)\s\1/);
// Matches: "hello hello"
```

**Example 2: Match HTML Tags**

`<(\w+)>.*?</\1>` matches opening and closing tags

```javascript
// JavaScript - matches paired tags
"<div>content</div>".match(/<(\w+)>.*?<\/\1>/);
// Matches: "<div>content</div>"

"<h1>title</h2>".match(/<(\w+)>.*?<\/\1>/);
// No match (tags don't match)
```

**Example 3: Find Repeated Characters**

`(\w)\1+` matches consecutive repeated characters

```python
# Python - find double letters
re.findall(r'(\w)\1+', 'hello bookkeeper')
# Returns: ['l', 'o', 'k', 'e']
```

**Example 4: Match Quoted Strings (Same Quote Type)**

`(['"])(.*?)\1` matches strings with matching quotes

```javascript
// JavaScript
"He said \"hello\" and she said 'hi'".match(/(['"])(.*?)\1/g);
// Matches: ['"hello"', "'hi'"]
// Ensures opening and closing quotes match
```

---

## Alternation

Duration: 0:30

### OR Operator

`|` - matches either left or right pattern

**Examples:**

- `cat|dog` - matches "cat" or "dog"
- `(jpg|png|gif)` - image extensions
- `\b(Mr|Mrs|Ms|Dr)\b` - titles

---

## Lookarounds (Assertions)

Duration: 2:00

### Lookahead

- `(?=pattern)` - **Positive lookahead**: followed by pattern
  - `\d(?=px)` matches "5" in "5px" but not "5em"
- `(?!pattern)` - **Negative lookahead**: NOT followed by pattern
  - `\d(?!px)` matches "5" in "5em" but not "5px"

### Lookbehind

- `(?<=pattern)` - **Positive lookbehind**: preceded by pattern
  - `(?<=\$)\d+` matches "100" in "$100" but not "€100"
- `(?<!pattern)` - **Negative lookbehind**: NOT preceded by pattern
  - `(?<!\$)\d+` matches "100" in "€100" but not "$100"

**Complex example:**
`(?<=\$)\d+(?=\.00)` matches "50" in "$50.00"

---

## Flags & Modifiers

Duration: 1:00

### Common Flags

| Flag | Name              | Effect                              |
| ---- | ----------------- | ----------------------------------- |
| `i`  | Case-insensitive  | `/hello/i` matches "Hello", "HELLO" |
| `g`  | Global            | Find all matches, not just first    |
| `m`  | Multiline         | `^` and `$` match line breaks       |
| `s`  | Dotall/Singleline | `.` matches newlines too            |
| `u`  | Unicode           | Full Unicode support                |
| `y`  | Sticky            | Match from current position only    |

---

## Practical Examples

Duration: 3:00

### Real-World Workflow Examples

#### Example 1: Remove Comments from AI-Generated Code

When AI tools generate code with excessive comments, use regex to clean it up instantly instead of removing them one by one.

**Remove single-line comments (JavaScript, Java, C#, C++):**

- Find: `\s*//.*$`
- Replace with empty string

```javascript
// Before:
const x = 5; // Initialize variable
const y = 10; // Another variable

// After:
const x = 5;
const y = 10;
```

**Remove multi-line comments:**

- Find: `/\*[\s\S]*?\*/`
- Replace with empty string

```javascript
// Before:
/* This is a
   multi-line comment
   explaining the code */
function hello() {}

// After:
function hello() {}
```

**Remove Python comments:**

- Find: `\s*#.*$`
- Replace with empty string

```python
# Before:
x = 5  # Initialize variable
y = 10  # Another variable

# After:
x = 5
y = 10
```

#### Example 2: Clean HTML by Removing Class and Style Attributes

Remove inline styling and classes to get clean, semantic HTML structure.

**Remove class and style attributes:**

- Find: `\s*(class|style)=(["']).*?\2`
- Replace with empty string

```html:
<!-- Before: -->
<div class="container mt-5" style="color: red;">
  <p class="text-center" style="font-size: 14px;">Hello World</p>
</div>

<!-- After: -->
<div>
  <p>Hello World</p>
</div>
```

### Find & Replace Examples

**Remove extra spaces:**

- Find: `\s+`
- Replace: ` ` (single space)

**Swap names:**

- Find: `(\w+),\s*(\w+)`
- Replace: `$2 $1`

---

### LeetCode Problems Solved with Regex

Regex can be surprisingly powerful for solving coding challenges. Here are some LeetCode problems solved elegantly with regex.

#### Problem 1: Decode String (LeetCode #394)

**Problem:** Given an encoded string, return its decoded string. The encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times.

**Examples:**

- Input: `"3[a]2[bc]"` → Output: `"aaabcbc"`
- Input: `"3[a2[c]]"` → Output: `"accaccacc"`
- Input: `"2[abc]3[cd]ef"` → Output: `"abcabccdcdcdef"`

**Regex Solution:**

```python
import re

class Solution:
    def decodeString(self, s: str) -> str:
        pattern = r'(\d+)\[([a-z]+)\]'

        while re.search(pattern, s):
            s = re.sub(
                pattern,
                lambda m: int(m.group(1)) * m.group(2),
                s
            )

        return s
```

**How it works:**

- Pattern `(\d+)\[([a-z]+)\]` matches number + `[letters]`
- Group 1: the number (`k`)
- Group 2: the letters to repeat
- Lambda function multiplies the string by the number
- Loop handles nested patterns from inside out

---

#### Problem 2: Valid Parentheses (LeetCode #20)

**Problem:** Given a string containing just the characters `'(', ')', '{', '}', '[' and ']'`, determine if the input string is valid (properly balanced and nested).

**Examples:**

- Input: `"()"` → Output: `true`
- Input: `"()[]{}"` → Output: `true`
- Input: `"(]"` → Output: `false`
- Input: `"([)]"` → Output: `false`

**Regex Solution:**

```python
import re

class Solution:
    def isValid(self, s: str) -> bool:
        if len(s) <= 1:
            return False

        pattern = r'\(\)|\[\]|\{\}'

        while re.search(pattern, s):
            s = re.sub(pattern, '', s)

        return s == ''
```

**How it works:**

- Pattern `\(\)|\[\]|\{\}` matches any valid pair: `()`, `[]`, or `{}`
- Repeatedly remove valid pairs until none remain
- If string is empty, all brackets were properly matched
- If anything remains, brackets were invalid

---

#### Problem 3: Valid Palindrome (LeetCode #125)

**Problem:** A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

**Examples:**

- Input: `"A man, a plan, a canal: Panama"` → Output: `true`
- Input: `"race a car"` → Output: `false`

**Regex Solution:**

```python
import re

class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = re.sub(r'[^\w]', '', s).lower()
        return cleaned == cleaned[::-1]
```

**How it works:**

- Pattern `[^\w]` matches any non-word character (not letter/digit/underscore)
- `re.sub()` removes all non-alphanumeric characters
- `.lower()` converts to lowercase
- Compare with reversed string `[::-1]`

---

#### Problem 4: Word Compression

**Problem:** Remove groups of exactly `k` consecutive equal characters repeatedly until no more operations are possible.

**Example:**

- Input: `word = "abbcccb"`, `k = 3`
- Remove `"ccc"`: `"abbcccb"` → `"abbb"`
- Remove `"bbb"`: `"abbb"` → `"a"`
- Output: `"a"`

**Regex Solution:**

```javascript
function compressWord(word, k) {
  const regex = new RegExp(`(.)\\1{${k - 1}}`, "g");
  
  while (regex.test(word)) {
    word = word.replace(regex, "");
  }
  
  return word;
}
```

**How it works:**

- Pattern `(.)\1{k-1}` matches exactly `k` consecutive identical characters
  - `(.)` captures any character
  - `\1{k-1}` backreferences that character exactly `k-1` more times
  - Total: `k` consecutive matches
- Dynamic regex construction with template literal
- Loop while pattern matches exist, replacing them
- `regex.lastIndex = 0` resets the regex index for the next iteration
- Example with `k=3`: `(.)\1{2}` matches 3 identical chars like `"aaa"` or `"bbb"`

**Key insight:** Backreference `\1` ensures all characters are identical!

---

### Regex in Popular Web Frameworks

Many modern web frameworks use regex internally for routing, validation, and pattern matching. Here are real-world examples from production frameworks.

#### FastAPI / Starlette - Path Parameter Matching

FastAPI (built on Starlette) uses regex to parse path parameters from route definitions.

**Internal Implementation:**

From [Starlette's routing.py](https://github.com/Kludex/starlette/blob/c14d0f778010940ac40f97dbc23d8dbf99e87e23/starlette/routing.py#L107):

```python
PARAM_REGEX = re.compile("{([a-zA-Z_][a-zA-Z0-9_]*)(:[a-zA-Z_][a-zA-Z0-9_]*)?}")
```

**What it does:**
- Matches route parameters like `{user_id}` or `{user_id:path}`
- Group 1: `([a-zA-Z_][a-zA-Z0-9_]*)` - parameter name (must start with letter or underscore)
- Group 2: `(:[a-zA-Z_][a-zA-Z0-9_]*)?` - optional type converter (like `:path`, `:int`)

**Example:**
```python
@app.get("/users/{user_id}/posts/{post_id:int}")
# Starlette extracts: user_id (string), post_id (int)
```

#### FastAPI - Pydantic Regex Validation

FastAPI uses Pydantic for request validation, which supports regex constraints.

**Field-level validation:**

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    # Name must be uppercase letters only
    name: str = Field(pattern="^[A-Z]+$")
    
    # Email validation
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    
    # Phone number (US format)
    phone: str = Field(pattern=r"^\d{3}-\d{3}-\d{4}$")
```

**Query parameter validation:**

```python
from fastapi import Query

@app.get("/items/")
def read_items(
    q: str = Query(..., pattern="^fixedquery$"),  # Must match exactly
    tag: str = Query(None, pattern="^[a-z0-9-]+$")  # Lowercase alphanumeric with hyphens
):
    return {"q": q, "tag": tag}
```

#### Next.js - Route Matching

Next.js uses a file-system based routing, but internally compiles routes into regex patterns for matching.

**Dynamic Routes:**

File structure:
```
pages/
  users/
    [id].js          → Matches /users/123, /users/abc
    [...slug].js     → Matches /users/a/b/c (catch-all)
```

**Internal regex compilation:**

Next.js converts these to regex patterns like:
```javascript
// [id].js becomes:
/^\/users\/([^/]+?)(?:\/)?$/

// [...slug].js becomes:
/^\/users\/(.+?)(?:\/)?$/
```

---
