import { pgPool } from "../infra/postgres";

export async function insertOrder(id: string, amount: number) {
  await pgPool.query(
    `INSERT INTO orders(id, amount, status)
     VALUES($1,$2,'CREATED')`,
    [id, amount],
  );
}

export async function updateOrderStatus(id: string, status: string) {
  await pgPool.query(
    `UPDATE orders
     SET status=$1,
         updated_at=NOW()
     WHERE id=$2`,
    [status, id],
  );
}

export async function getOrder(id: string) {
  const result = await pgPool.query(`SELECT * FROM orders WHERE id=$1`, [id]);
  return result.rows[0];
}
