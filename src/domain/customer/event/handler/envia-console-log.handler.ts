import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedEvent from "../customer-changed.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerChangedEvent>
{
  handle(event: CustomerChangedEvent): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`); 
  }
}
