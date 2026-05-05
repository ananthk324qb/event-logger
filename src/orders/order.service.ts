import { ulid } from "ulid";
import { insertOrder, updateOrderStatus, getOrder } from "./order.repository";
import { logEvent } from "../event-engine/event.service";
import { ErrorTemplate } from "../common/error";

export async function createOrder(amount: number, user: any) {
  const orderId = ulid();

  await insertOrder(orderId, amount);

  await logEvent({
    entityType: "ORDER",
    entityId: orderId,
    eventType: "OrderCreated",
    actor: {
      userId: user.userId,
      role: user.role,
    },
    payload: { amount },
  });

  return orderId;
}

export async function fetchOrder(id: string) {
  const order = await getOrder(id);

  if (!order) throw new ErrorTemplate("Order not found", 404);

  return order;
}

export async function shipOrder(id: string, user: any) {
  const order = await getOrder(id);

  if (!order) throw new ErrorTemplate("Order not found", 404);

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

  if (!order) throw new ErrorTemplate("Order not found", 404);

  if (order.status === "CANCELLED") {
    throw new ErrorTemplate("Order is already cancelled", 409);
  }

  await updateOrderStatus(id, "CANCELLED");

  await logEvent({
    entityType: "ORDER",
    entityId: id,
    eventType: "OrderCancelled",
    actor: user,
  });
}
