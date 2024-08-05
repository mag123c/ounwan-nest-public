import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { TransactionCommitEvent } from 'typeorm/subscriber/event/TransactionCommitEvent';
import { TransactionStartEvent } from 'typeorm/subscriber/event/TransactionStartEvent';
  
  @EventSubscriber()
  export class MyEventSubscriber implements EntitySubscriberInterface {
    /**
     * Called before post insertion.
     */
    async beforeInsert(event: InsertEvent<any>) {  
    }
  
    /**
     * Called before entity update.
     */
    async beforeUpdate(event: UpdateEvent<any>) {  
    }

    /**
     * Called before entity remove.
     */
    async beforeRemove(event: RemoveEvent<any>) {
    }
  
    /**
     * Called before transaction start.
     */
    async beforeTransactionStart(event: TransactionStartEvent) {
    }
  
    /**
     * Called before transaction commit.
     */
    async beforeTransactionCommit(event: TransactionCommitEvent) {
    }
  }
  