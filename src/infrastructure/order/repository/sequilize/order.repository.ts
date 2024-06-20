import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    const order = await this.find(entity.id);

    const excluir = order.items.filter(oi => entity.items.find(ei => ei.id == oi.id) == null);

    excluir.forEach(async (item) => {
      await this.deleteItem(item.id, entity.id);
    });

    entity.items.forEach(async item => await this.createUpdateItem({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id
    }));

    await OrderModel.update(
      {
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  private async deleteItem(id: string, order_id: string): Promise<void> {
    await OrderItemModel.destroy({ where: { id: id, order_id: order_id } });
  }

  private async createUpdateItem(item: any): Promise<void> {
    await OrderItemModel.upsert(item);
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id }, include: [OrderItemModel] });
    return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)));
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: [OrderItemModel] });
    return orderModels.map((orderModel) =>
      new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)))
    );
  }
}
