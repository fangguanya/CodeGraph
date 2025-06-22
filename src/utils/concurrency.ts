import { createContextLogger } from './logger.js';

const logger = createContextLogger('ConcurrencyController');

/**
 * 并发控制器 - 限制同时执行的异步操作数量
 * 用于防止"EMFILE: too many open files"错误
 */
export class ConcurrencyController {
    private maxConcurrent: number;
    private running: number = 0;
    private queue: Array<() => void> = [];

    constructor(maxConcurrent: number) {
        this.maxConcurrent = maxConcurrent;
        logger.info(`ConcurrencyController initialized with max ${maxConcurrent} concurrent operations`);
    }

    /**
     * 执行任务，如果达到并发限制则排队等待
     */
    async execute<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const runTask = async () => {
                this.running++;
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.running--;
                    if (this.queue.length > 0) {
                        const nextTask = this.queue.shift();
                        if (nextTask) {
                            setImmediate(nextTask);
                        }
                    }
                }
            };

            if (this.running < this.maxConcurrent) {
                runTask();
            } else {
                this.queue.push(runTask);
            }
        });
    }

    /**
     * 获取当前状态信息
     */
    getStatus() {
        return {
            running: this.running,
            queued: this.queue.length,
            maxConcurrent: this.maxConcurrent,
            total: this.running + this.queue.length
        };
    }
}