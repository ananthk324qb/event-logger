import { ulid } from "ulid";
import { insertOrder, getOrder, writeOrderStatus } from "./order.repository";
import { logEvent } from "../event-engine/event.service";
import { ErrorTemplate } from "../common/error";

export async function createOrder(amount: number, user: any) {
  const orderId = ulid();

  await insertOrder(orderId, amount);

  await logEvent({
    entityType: "ORDER",
    entityId: orderId,
    eventType: "CREATED",
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

export async function updateOrderStatus(id: string, user: any, status: string) {
  const order = await getOrder(id);

  if (!order) throw new ErrorTemplate("Order not found", 404);

  switch (status) {
    case "PACKED":
      if (order.status !== "CREATED") {
        throw new ErrorTemplate("Order must be created to be packed", 400);
      }
      await writeOrderStatus(id, "PACKED");
      break;
    case "SHIPPED":
      if (order.status !== "PACKED") {
        throw new ErrorTemplate("Order must be packed to be shipped", 400);
      }
      await writeOrderStatus(id, "SHIPPED");
      break;
    case "CANCELLED":
      if (order.status === "CANCELLED") {
        throw new ErrorTemplate("Order already cancelled", 400);
      }
      await writeOrderStatus(id, "CANCELLED");
      break;
    default:
      throw new ErrorTemplate("Invalid status", 400);
  }

  await logEvent({
    entityType: "ORDER",
    entityId: id,
    eventType: status,
    actor: user,
  });
}
