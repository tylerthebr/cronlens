# cronlens

> A human-readable cron expression parser and validator with next-run preview in the terminal.

---

## Installation

```bash
npm install -g cronlens
```

---

## Usage

Parse and validate any cron expression directly from your terminal:

```bash
cronlens "*/5 * * * *"
```

**Output:**
```
Expression : */5 * * * *
Description: Every 5 minutes
Status     : ✓ Valid

Upcoming runs:
  1. Mon, 14 Jul 2025 10:25:00
  2. Mon, 14 Jul 2025 10:30:00
  3. Mon, 14 Jul 2025 10:35:00
  4. Mon, 14 Jul 2025 10:40:00
  5. Mon, 14 Jul 2025 10:45:00
```

You can also use it programmatically:

```js
import { parse, validate, nextRuns } from 'cronlens';

const expr = '0 9 * * 1-5';

console.log(validate(expr));   // true
console.log(parse(expr));      // "At 09:00, Monday through Friday"
console.log(nextRuns(expr, 3)); // [...next 3 Date objects]
```

### Options

| Flag | Description |
|------|-------------|
| `--count <n>` | Number of upcoming runs to preview (default: 5) |
| `--utc` | Display times in UTC |
| `--json` | Output results as JSON |

---

## License

[MIT](./LICENSE)