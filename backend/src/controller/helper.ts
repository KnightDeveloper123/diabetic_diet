
import connection from "../config/db.js";

export function executeQuery(
  query: string,
  values: unknown[] = []
): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}