/**
 * Synchronize Payload's schema into the persistent SQLite database before the
 * production server starts. The SQLite adapter performs schema push only when
 * NODE_ENV is not production, so this script runs in a one-shot tools image.
 */
async function initializeDatabase() {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('../payload.config'),
  ])

  const payload = await getPayload({ config: await config })
  payload.logger.info('Portfolio SQLite schema is ready.')
  await payload.destroy()
}

initializeDatabase().catch((error) => {
  console.error(error)
  process.exit(1)
})
