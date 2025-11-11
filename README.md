# MongoDB Exporter

A simple Node.js script to export all collections from a MongoDB database to JSON files.

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

Run the export script:

```bash
npm start
```

All collections will be exported to the `mongo_exports/` directory as individual JSON files.
