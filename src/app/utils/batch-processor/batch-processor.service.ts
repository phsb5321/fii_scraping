import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BatchProcessorService {
  private readonly logger = new Logger(BatchProcessorService.name);

  /**
   * Processes items in batches and logs the progress.
   *
   * @param items - Items to be processed in batches
   * @param processBatch - Function that processes a batch of items
   * @param requestsLimit - Maximum limit for requests
   * @param batchSize - Number of items to be processed in each batch
   * @param timeFrameMultiplier - Used to calculate the time to be waited between each batch
   * @returns {Promise<void>}
   */
  async executeInBatches<T>(
    items: T[],
    processBatch: (items: T[]) => Promise<void>,
    requestsLimit: number,
    batchSize: number,
    timeFrameMultiplier: number,
  ): Promise<void> {
    const timeBetweenRequests =
      ((items.length / requestsLimit) * timeFrameMultiplier) / Math.ceil(items.length / batchSize);

    this.logger.verbose(
      `The batch process will take approximately ${(
        (timeBetweenRequests * Math.ceil(items.length / batchSize)) /
        (60 * 1000)
      ).toFixed(2)} minutes`,
    );

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      this.logger.verbose(`Processing batch ${i / batchSize + 1} of ${Math.ceil(items.length / batchSize)}`);
      await processBatch(batch);
      await this.delay(timeBetweenRequests);
      this.logger.verbose(`Processed batch ${i / batchSize + 1} of ${Math.ceil(items.length / batchSize)}`);
    }
  }

  /**
   * Delays the execution by ms milliseconds
   *
   * @param ms - Delay time in milliseconds
   * @returns {Promise<void>}
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
