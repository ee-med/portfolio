import { getPayload } from 'payload'
import configPromise from '@/payload.config'

/**
 * Returns a cached-per-request Payload local API client.
 * Use inside Server Components / route handlers to query collections
 * and globals without an HTTP round-trip.
 */
export async function getPayloadClient() {
  const config = await configPromise
  return getPayload({ config })
}
