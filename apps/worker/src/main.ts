/**
 * BullMQ Worker — main entry point.
 */
import { Worker, type Job } from "bullmq";
import { Redis } from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

async function main() {
  console.log("⚙️ Thiên Nam Worker khởi động...");

  // Daily reset worker
  const dailyWorker = new Worker(
    "daily-reset",
    async (job: Job) => {
      console.log(`[Daily Reset] Processing job ${job.id}`);
      // TODO: Implement daily reset logic
    },
    {
      connection: redisConnection,
      concurrency: 1,
    },
  );

  // Seclusion completion worker
  const seclusionWorker = new Worker(
    "seclusion-complete",
    async (job: Job<{ characterId: string; pointsEarned: number }>) => {
      console.log(`[Seclusion] Job ${job.id} for character ${job.data.characterId}`);
      const { pointsEarned } = job.data;
      // TODO: Apply seclusion rewards
      return { success: true, pointsEarned };
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  );

  // World event worker
  const eventWorker = new Worker(
    "world-event",
    async (job: Job) => {
      console.log(`[World Event] Processing job ${job.id}`);
      // TODO: Process world events
    },
    {
      connection: redisConnection,
      concurrency: 3,
    },
  );

  // Error handlers
  dailyWorker.on("failed", (job, err) => {
    console.error(`[Daily Reset] Job ${job?.id} failed:`, err);
  });

  seclusionWorker.on("failed", (job, err) => {
    console.error(`[Seclusion] Job ${job?.id} failed:`, err);
  });

  eventWorker.on("failed", (job, err) => {
    console.error(`[World Event] Job ${job?.id} failed:`, err);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down workers...");
    await dailyWorker.close();
    await seclusionWorker.close();
    await eventWorker.close();
    await redisConnection.quit();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log("✅ Workers running:");
  console.log("  - daily-reset (concurrency: 1)");
  console.log("  - seclusion-complete (concurrency: 5)");
  console.log("  - world-event (concurrency: 3)");
}

main().catch((err) => {
  console.error("Worker startup failed:", err);
  process.exit(1);
});
