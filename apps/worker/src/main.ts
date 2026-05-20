/**
 * BullMQ Worker — main entry point.
 */
import { Worker, type Job, Queue } from 'bullmq'
import { Redis } from 'ioredis'
import { processDailyReset, type DailyResetJob } from './workers/daily-reset.js'
import { processInjuryExpirations, type InjuryExpireJob } from './workers/injury-expire.js'
import {
  processSeclusionCompletion,
  type SeclusionCompleteJob,
} from './workers/seclusion-complete.js'
import {
  processWorldEventExpirations,
  type WorldEventExpireJob,
} from './workers/world-event-expire.js'

const redisConnection = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

async function main() {
  console.log('⚙️ Thiên Nam Worker khởi động...')

  // Injury expiration queue — schedules periodic cleanup
  const injuryQueue = new Queue<InjuryExpireJob>('injury-expire', {
    connection: redisConnection,
  })

  // Set up recurring injury expire job every 15 minutes
  await injuryQueue.add(
    'scheduled-cleanup',
    {},
    {
      repeat: {
        pattern: '*/15 * * * *', // Every 15 minutes
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
  )
  console.log('[Scheduler] Injury expire cron registered: */15 * * * *')

  // Daily reset worker
  const dailyWorker = new Worker(
    'daily-reset',
    async (job: Job<DailyResetJob>) => {
      console.log(`[Daily Reset] Processing job ${job.id}`)
      return processDailyReset(job)
    },
    {
      connection: redisConnection,
      concurrency: 1,
    },
  )

  // Seclusion completion worker
  const seclusionWorker = new Worker(
    'seclusion-complete',
    async (job: Job<SeclusionCompleteJob>) => {
      console.log(`[Seclusion] Job ${job.id} for character ${job.data.characterId}`)
      return processSeclusionCompletion(job)
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  )

  // World event worker
  const eventWorker = new Worker(
    'world-event',
    async (job: Job<WorldEventExpireJob>) => {
      console.log(`[World Event] Processing job ${job.id}`)
      return processWorldEventExpirations(job)
    },
    {
      connection: redisConnection,
      concurrency: 3,
    },
  )

  // Injury expiration worker
  const injuryWorker = new Worker(
    'injury-expire',
    async (job: Job<InjuryExpireJob>) => {
      console.log(`[Injury Expire] Processing job ${job.id}`)
      const result = await processInjuryExpirations(job)
      return result
    },
    {
      connection: redisConnection,
      concurrency: 1,
    },
  )

  // Error handlers
  dailyWorker.on('failed', (job, err) => {
    console.error(`[Daily Reset] Job ${job?.id} failed:`, err)
  })

  seclusionWorker.on('failed', (job, err) => {
    console.error(`[Seclusion] Job ${job?.id} failed:`, err)
  })

  eventWorker.on('failed', (job, err) => {
    console.error(`[World Event] Job ${job?.id} failed:`, err)
  })

  injuryWorker.on('failed', (job, err) => {
    console.error(`[Injury Expire] Job ${job?.id} failed:`, err)
  })

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down workers...')
    await dailyWorker.close()
    await seclusionWorker.close()
    await eventWorker.close()
    await injuryWorker.close()
    await injuryQueue.close()
    await redisConnection.quit()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  console.log('Workers running:')
  console.log('  - daily-reset (concurrency: 1)')
  console.log('  - seclusion-complete (concurrency: 5)')
  console.log('  - world-event (concurrency: 3)')
  console.log('  - injury-expire (concurrency: 1)')
}

main().catch((err) => {
  console.error('Worker startup failed:', err)
  process.exit(1)
})
