export interface QueueItem {
    severity: number;
    patientId: string;
}
export declare class PriorityQueue {
    private heap;
    enqueue(item: QueueItem): void;
    dequeue(): QueueItem | undefined;
    peek(): QueueItem | undefined;
    isEmpty(): boolean;
    size(): number;
}
//# sourceMappingURL=PriorityQueue.d.ts.map