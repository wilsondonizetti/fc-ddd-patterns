import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerChangedEvent from "./customer-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";

describe("Customer unit test", () => {
    it("should create a customer", async () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            address: new Address("rua 1", 10, "00000-000","cidade"),
            rewardPoints: 10.0,
          });
        
        // Quando o notify for executado o EnviaConsoleLog1Handler.handle() e o EnviaConsoleLog2Handler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent);        

        expect(spyEventHandler).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
        
    });

    it("should change a customer", async () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        
        const spyEventHandler = jest.spyOn(eventHandler, "handle");        

        eventDispatcher.register("CustomerChangedEvent", eventHandler);        

        expect(
        eventDispatcher.getEventHandlers["CustomerChangedEvent"][0]
        ).toMatchObject(eventHandler);

        const customerChangedEvent = new CustomerChangedEvent({
            id: "123",
            name: "Customer 1",
            address: new Address("rua 1", 25, "00000-000","cidade exemplo"),
            rewardPoints: 15.0,
          });
        
        // Quando o notify for executado o EnviaConsoleLogHandler.handle() deve ser chamado
        eventDispatcher.notify(customerChangedEvent);        

        expect(spyEventHandler).toHaveBeenCalled();        
        
    });
});