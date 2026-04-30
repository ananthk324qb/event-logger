import { v4 as uuid } from "uuid";
import { insertOrder, updateOrderStatus, getOrder } from "./order.repository";
import { logEvent } from "../event-engine/event.service";

export async function createOrder(amount: number, user: any) {
  const id = uuid();

  await insertOrder(id, amount);

  await logEvent({
    entityType: "ORDER",
    entityId: id,
    eventType: "OrderCreated",
    actor: {
      userId: user.userId,
      role: user.role,
    },
    payload: { amount },
  });

  return id;
}

export async function fetchOrder(id: string) {
  const order = await getOrder(id);

  return order;
}

export async function shipOrder(id: string, user: any) {
  const order = await getOrder(id);
  if (!order) throw new Error("Order not found");
  if (order.status !== "CREATED") throw new Error("Cannot ship");

  await updateOrderStatus(id, "SHIPPED");

  await logEvent({
    entityType: "ORDER",
    entityId: id,
    eventType: "OrderShipped",
    actor: user,
  });
}

export async function cancelOrder(id: string, user: any) {
  const order = await getOrder(id);

  if (!order) throw new Error("Order not found");

  await updateOrderStatus(id, "CANCELLED");

  await logEvent({
    entityType: "ORDER",
    entityId: id,
    eventType: "OrderCancelled",
    actor: user,
  });
}
