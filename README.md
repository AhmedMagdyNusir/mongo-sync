# Mongo Sync

A simple Node.js tool to export and import collections from a MongoDB database to/from JSON files.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
```

## Usage

### Export Collections

Export all collections to JSON files in **Extended JSON format** (MongoDB format, compatible with MongoDB Compass):

```bash
npm run export
```

This will export data in Extended JSON format with proper MongoDB types:

- ObjectIds are exported as `{ "$oid": "..." }`
- Dates are exported as `{ "$date": "..." }`

This format is **recommended** as it preserves MongoDB data types and is fully compatible with imports.

#### Export in Plain JSON Format

If you need plain JSON without MongoDB type annotations:

```bash
npm run export:plain
```

**Note:** Plain format may lose type information (ObjectIds and Dates become strings), which could cause issues during import.

Each export creates a new folder under `exports/` named `<database-name>_<YYYY-MM-DD_HH-MM-SS>/` (for example `mydb_2026-04-19_10-30-00/`). Collection data is written as individual JSON files inside that folder. Previous exports are kept; each run adds a new timestamped directory.

---

### Import Collections

Import JSON files back into MongoDB:

```bash
npm run import
```

This reads all JSON files from the **`imports/`** directory (at the project root) and imports them into the database. Copy the files you want to import into `imports/` (for example from a folder under `exports/`). The `imports/` directory is created automatically if it does not exist.

**Use Extended JSON format:**

- The import tool supports both **Extended JSON format** (with `$oid` and `$date`) and plain JSON format.
- **Extended JSON format is recommended** to ensure proper data types are preserved (ObjectIds, Dates, etc.).

> It is recommended that the database is pre-created with all the necessary indexes for each collection before performing the import to avoid performance issues or duplicates.

---

### Delete All Documents ⚠️

Delete all documents from all collections in the database:

```bash
npm run delete
```

**WARNING:** This is a destructive operation that will permanently delete all documents from every collection in your database!

**Safety Features:**

- Three-level confirmation process
- Requires typing 'YES' to confirm
- Requires typing the exact database name
- Requires typing a randomly generated confirmation code
- Shows all collections that will be affected before deletion
