# MongoDB Exporter & Importer

A simple Node.js script to export and import collections from a MongoDB database to/from JSON files.

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

### Import Collections

Import JSON files back into MongoDB:

```bash
npm run import
```

This will read all JSON files from the `data/` directory and import them into the database.

---

**Note:** The import script uses `insertMany` with `ordered: false`, which means:

- It will attempt to import all documents even if some fail
- Duplicate `_id` errors will be handled gracefully
- You may see errors if documents already exist in the database
