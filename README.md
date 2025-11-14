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

Export all collections to JSON files:

```bash
npm run export
```

All collections will be exported to the `data/` directory as individual JSON files.

---

### Import Collections

Import JSON files back into MongoDB:

```bash
npm run import
```

This will read all JSON files from the `data/` directory and import them into the database.

**Note:** It is recommended that the database is pre-created with all the necessary indexes for each collection before performing the import to avoid performance issues or duplicates.

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
