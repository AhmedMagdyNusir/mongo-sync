const { ObjectId } = require("mongodb");

/**
 * Converts a MongoDB document to Extended JSON format (like MongoDB Compass exports)
 * This format uses $oid for ObjectIds and $date for Date objects
 */
function toExtendedJSON(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle ObjectId
  if (obj instanceof ObjectId) {
    return { $oid: obj.toString() };
  }

  // Handle Date
  if (obj instanceof Date) {
    return { $date: obj.toISOString() };
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => toExtendedJSON(item));
  }

  // Handle Objects
  if (typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = toExtendedJSON(obj[key]);
      }
    }
    return result;
  }

  // Return primitive values as-is
  return obj;
}

/**
 * Converts Extended JSON format back to native MongoDB types
 * Converts $oid to ObjectId and $date to Date objects
 */
function fromExtendedJSON(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Extended JSON ObjectId format
  if (
    typeof obj === "object" &&
    obj.$oid !== undefined &&
    Object.keys(obj).length === 1
  ) {
    return new ObjectId(obj.$oid);
  }

  // Handle Extended JSON Date format
  if (
    typeof obj === "object" &&
    obj.$date !== undefined &&
    Object.keys(obj).length === 1
  ) {
    return new Date(obj.$date);
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => fromExtendedJSON(item));
  }

  // Handle Objects
  if (typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = fromExtendedJSON(obj[key]);
      }
    }
    return result;
  }

  // Return primitive values as-is
  return obj;
}

module.exports = {
  toExtendedJSON,
  fromExtendedJSON,
};
