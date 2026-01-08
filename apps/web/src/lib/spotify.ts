/**
 * Spotify Web API Integration
 *
 * Utility functions for verifying user actions on Spotify.
 * Used for automatic mission verification.
 */

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

/**
 * Error class for Spotify API errors
 */
export class SpotifyApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message)
    this.name = 'SpotifyApiError'
  }
}

/**
 * Check if the authenticated user follows a specific artist on Spotify
 *
 * @param accessToken - User's Spotify access token
 * @param artistId - Spotify artist ID to check
 * @returns boolean indicating whether the user follows the artist
 * @throws SpotifyApiError if the API request fails
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/check-current-user-follows
 */
export async function checkUserFollowsArtist(
  accessToken: string,
  artistId: string
): Promise<boolean> {
  const url = `${SPOTIFY_API_BASE}/me/following/contains?type=artist&ids=${encodeURIComponent(artistId)}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      errorData.error?.message || `Spotify API error: ${response.status}`,
      response.status,
      errorData.error?.reason
    )
  }

  // API returns an array of booleans, one for each artist ID requested
  const [follows] = await response.json()
  return follows === true
}

/**
 * Check if the authenticated user follows multiple artists on Spotify
 *
 * @param accessToken - User's Spotify access token
 * @param artistIds - Array of Spotify artist IDs to check (max 50)
 * @returns Object mapping artist IDs to follow status
 * @throws SpotifyApiError if the API request fails
 */
export async function checkUserFollowsArtists(
  accessToken: string,
  artistIds: string[]
): Promise<Record<string, boolean>> {
  if (artistIds.length === 0) return {}
  if (artistIds.length > 50) {
    throw new Error('Maximum 50 artist IDs allowed per request')
  }

  const url = `${SPOTIFY_API_BASE}/me/following/contains?type=artist&ids=${artistIds.map(encodeURIComponent).join(',')}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      errorData.error?.message || `Spotify API error: ${response.status}`,
      response.status,
      errorData.error?.reason
    )
  }

  const results: boolean[] = await response.json()

  // Map artist IDs to their follow status
  return artistIds.reduce(
    (acc, id, index) => {
      acc[id] = results[index] === true
      return acc
    },
    {} as Record<string, boolean>
  )
}

/**
 * Check if the authenticated user has saved a specific track
 *
 * @param accessToken - User's Spotify access token
 * @param trackId - Spotify track ID to check
 * @returns boolean indicating whether the user has saved the track
 * @throws SpotifyApiError if the API request fails
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/check-users-saved-tracks
 */
export async function checkUserSavedTrack(
  accessToken: string,
  trackId: string
): Promise<boolean> {
  const url = `${SPOTIFY_API_BASE}/me/tracks/contains?ids=${encodeURIComponent(trackId)}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      errorData.error?.message || `Spotify API error: ${response.status}`,
      response.status,
      errorData.error?.reason
    )
  }

  const [saved] = await response.json()
  return saved === true
}

/**
 * Check if the authenticated user has saved a specific album
 *
 * @param accessToken - User's Spotify access token
 * @param albumId - Spotify album ID to check
 * @returns boolean indicating whether the user has saved the album
 * @throws SpotifyApiError if the API request fails
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/check-users-saved-albums
 */
export async function checkUserSavedAlbum(
  accessToken: string,
  albumId: string
): Promise<boolean> {
  const url = `${SPOTIFY_API_BASE}/me/albums/contains?ids=${encodeURIComponent(albumId)}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      errorData.error?.message || `Spotify API error: ${response.status}`,
      response.status,
      errorData.error?.reason
    )
  }

  const [saved] = await response.json()
  return saved === true
}

/**
 * Check if the authenticated user follows a specific playlist
 *
 * @param accessToken - User's Spotify access token
 * @param playlistId - Spotify playlist ID to check
 * @param userId - Spotify user ID to check (the authenticated user)
 * @returns boolean indicating whether the user follows the playlist
 * @throws SpotifyApiError if the API request fails
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/check-if-user-follows-playlist
 */
export async function checkUserFollowsPlaylist(
  accessToken: string,
  playlistId: string,
  userId: string
): Promise<boolean> {
  const url = `${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(playlistId)}/followers/contains?ids=${encodeURIComponent(userId)}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      errorData.error?.message || `Spotify API error: ${response.status}`,
      response.status,
      errorData.error?.reason
    )
  }

  const [follows] = await response.json()
  return follows === true
}

/**
 * Get the current user's Spotify profile
 *
 * @param accessToken - User's Spotify access token
 * @returns Spotify user profile data
 * @throws SpotifyApiError if the API request fails
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 */
export async function getCurrentUserProfile(accessToken: string): Promise<{
  id: string
  display_name: string | null
  email?: string
  images: Array<{ url: string; height: number | null; width: number | null }>
  followers: { total: number }
  country?: string
  product?: string
}> {
  const url = `${SPOTIFY_API_BASE}/me`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      errorData.error?.message || `Spotify API error: ${response.status}`,
      response.status,
      errorData.error?.reason
    )
  }

  return response.json()
}

/**
 * Get user's Spotify access token from database
 *
 * @param userId - Internal user ID
 * @returns Access token or null if not found/expired
 */
export async function getUserSpotifyToken(userId: string): Promise<string | null> {
  const { db } = await import('@/lib/db')

  const account = await db.account.findFirst({
    where: {
      userId,
      provider: 'spotify',
    },
    select: {
      access_token: true,
      expires_at: true,
      refresh_token: true,
    },
  })

  if (!account?.access_token) {
    return null
  }

  // Check if token is expired
  if (account.expires_at && account.expires_at * 1000 < Date.now()) {
    // Token expired - attempt refresh if we have a refresh token
    if (account.refresh_token) {
      try {
        const newToken = await refreshSpotifyToken(userId, account.refresh_token)
        return newToken
      } catch {
        return null
      }
    }
    return null
  }

  return account.access_token
}

/**
 * Refresh an expired Spotify access token
 *
 * @param userId - Internal user ID
 * @param refreshToken - Spotify refresh token
 * @returns New access token
 * @throws Error if refresh fails
 */
async function refreshSpotifyToken(userId: string, refreshToken: string): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify client credentials not configured')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Spotify token')
  }

  const data = await response.json()
  const { db } = await import('@/lib/db')

  // Update token in database
  await db.account.updateMany({
    where: {
      userId,
      provider: 'spotify',
    },
    data: {
      access_token: data.access_token,
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      // Only update refresh_token if a new one was provided
      ...(data.refresh_token && { refresh_token: data.refresh_token }),
    },
  })

  return data.access_token
}
