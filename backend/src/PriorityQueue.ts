// PriorityQueue.ts
// Severity-based max heap for patients
export interface QueueItem {
  severity: number;
  patientId: string;
}

export class PriorityQueue {
  private heap: QueueItem[] = [];

  enqueue(item: QueueItem) {
    // TODO: Implement max-heap insert logic
    this.heap.push(item);
    this.heap.sort((a, b) => b.severity - a.severity); // Placeholder
  }

  dequeue(): QueueItem | undefined {
    // TODO: Implement max-heap remove logic
    return this.heap.shift(); // Placeholder
  }

  peek(): QueueItem | undefined {
    return this.heap[0];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }
}
