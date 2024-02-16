import { active_text_cache_, text_cache__select, text_cache__upsert } from '@rappstack/domain--server/text_cache'
import { json__parse } from 'ctx-core/json'
import { id_be_memo_pair_, type nullish, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
import { domain_server_brookebrodack_env_ } from '../env/index.js'
import { youtube_channelListResponse_ } from './youtube_channelListResponse.js'
const ttl_ms = 24 * 60 * 60 * 1000
const text_cache_id = 'youtube#playlistItemListResponse'
export const [
	,
	youtube_playlistItemListResponse_a1_
] = id_be_memo_pair_<
	gapi.client.youtube.PlaylistItemListResponse[]|nullish,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('youtube_playlistItemListResponse_a1',
	(ctx, $)=>{
		const { GOOGLE_API_KEY, DEFAULT_UPLOADS_PLAYLIST_ID } = domain_server_brookebrodack_env_()
		const text_cache = text_cache__select(ctx, text_cache_id)
		const youtube_playlistItemListResponse_a1 = json__parse<gapi.client.youtube.PlaylistItemListResponse[]>(
			active_text_cache_(text_cache,
				{ ttl_ms })?.data)
		if (!youtube_playlistItemListResponse_a1) {
			let playlistId = youtube_channelListResponse_(ctx)?.items?.[0].contentDetails?.relatedPlaylists?.uploads
			if (!playlistId) {
				console.warn('Could not fetch playlistId...using DEFAULT_UPLOADS_PLAYLIST_ID')
				playlistId = DEFAULT_UPLOADS_PLAYLIST_ID
			}
			run(async ()=>{
				let nextPageToken:string|undefined = undefined
				const cache__youtube_playlistItemListResponse_a1 = json__parse<gapi.client.youtube.PlaylistItemListResponse[]>(
					text_cache?.data)
				const youtube_playlistItemListResponse_a1:gapi.client.youtube.PlaylistItemListResponse[] = []
				let page_idx = 0
				do {
					const url = new URL(
						`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${playlistId}&key=${GOOGLE_API_KEY}&maxResults=50`)
					if (nextPageToken) url.searchParams.set('pageToken', nextPageToken)
					const cache__youtube_playlistItemListResponse = cache__youtube_playlistItemListResponse_a1?.[page_idx]
					const cache_etag = cache__youtube_playlistItemListResponse?.etag
					const response = await fetch('' + url, {
						headers: cache_etag ? { 'If-None-Match': cache_etag } : undefined
					})
					if (!response.ok) {
						console.warn('youtube_playlistItemListResponse_a1|GET|' + response.status)
						$._ = json__parse(text_cache?.data)
						return
					}
					const is_cache_status = response.status === 304
					const playlistItemListResponse:gapi.client.youtube.PlaylistItemListResponse =
						is_cache_status
							? cache__youtube_playlistItemListResponse!
							: await response.json()
					youtube_playlistItemListResponse_a1.push(playlistItemListResponse)
					nextPageToken = playlistItemListResponse.nextPageToken
					page_idx++
				} while (nextPageToken)
				$._ = youtube_playlistItemListResponse_a1
				text_cache__upsert(
					ctx,
					text_cache_id,
					{
						data: JSON.stringify(youtube_playlistItemListResponse_a1),
						etag: youtube_playlistItemListResponse_a1[0]?.etag
					}
				).catch(err=>console.error(err))
			}).catch(err=>console.error(err))
			return null
		}
		return youtube_playlistItemListResponse_a1
	})
