"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityQueue = void 0;
class PriorityQueue {
    heap = [];
    enqueue(item) {
        // TODO: Implement max-heap insert logic
        this.heap.push(item);
        this.heap.sort((a, b) => b.severity - a.severity); // Placeholder
    }
    dequeue() {
        // TODO: Implement max-heap remove logic
        return this.heap.shift(); // Placeholder
    }
    peek() {
        return this.heap[0];
    }
    isEmpty() {
        return this.heap.length === 0;
    }
    size() {
        return this.heap.length;
    }
}
exports.PriorityQueue = PriorityQueue;
//# sourceMappingURL=PriorityQueue.js.map