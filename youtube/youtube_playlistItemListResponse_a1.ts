import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { text_cache_tbl } from '@rappstack/domain--server/schema'
import {
	active_text_cache_,
	text_cache__select,
	text_cache__upsert,
	text_cache_T
} from '@rappstack/domain--server/text_cache'
import { I } from 'ctx-core/combinators'
import { json__parse } from 'ctx-core/json'
import { id_be_memo_pair_, type nullish, nullish__none_, rmemo__wait, type sig_T, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import { google_api_key_ } from './google_api_key.js'
import { youtube_channelList_playlistId_ } from './youtube_channelListResponse.js'
const ttl_ms = 24 * 60 * 60 * 1000
const text_cache_id = 'youtube#playlistItemListResponse'
export const [
	,
	youtube_playlistItemListResponse_a1_
] = id_be_memo_pair_<
	gapi.client.youtube.PlaylistItemListResponse[]|nullish,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('youtube_playlistItemListResponse_a1', (ctx, $)=>{
	// refresh when etag is updated
	youtube_playlistItemListResponse_etag_(ctx)
	const text_cache = text_cache__select(ctx, text_cache_id)
	const youtube_playlistItemListResponse = json__parse<gapi.client.youtube.PlaylistItemListResponse[]>(
		active_text_cache_(text_cache,
			{ ttl_ms })?.data)
	if (!youtube_playlistItemListResponse) {
		youtube_playlistItemListResponse_a1__update(ctx, text_cache, $)
			.catch(err=>console.error(err))
		return null
	}
	return youtube_playlistItemListResponse
})
export const [
	,
	youtube_playlistItemListResponse_etag_
] = id_be_memo_pair_<
	string|null|undefined,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('youtube_playlistItemListResponse_etag', (ctx, $)=>{
	return nullish__none_([youtube_channelList_playlistId_(ctx)], ()=>{
		const etag = drizzle_db_(ctx)
			.select({ etag: text_cache_tbl.etag })
			.from(text_cache_tbl)
			.where(eq(text_cache_tbl.text_cache_id, text_cache_id))
			.limit(1)
			.all()[0]
			?.etag
		if (!etag) {
			youtube_playlistItemListResponse_a1_(ctx)
			return null
		}
		const url = url_(ctx)
		fetch(url, { headers: { 'If-None-Match': etag } })
			.then(async response=>{
				if (response.status === 304) {
					$._ = etag
					return
				} else {
					$._ = null
					const data = await response.json()
					$._ = data.etag
				}
			})
			.catch(err=>console.error(err))
		return $.val
	})
})
async function youtube_playlistItemListResponse_a1__update(
	ctx:wide_ctx_T&wide_app_ctx_T,
	text_cache:text_cache_T,
	$:sig_T<gapi.client.youtube.PlaylistItemListResponse[]|nullish>
) {
	let nextPageToken:string|undefined = undefined
	const cache__youtube_playlistItemListResponse_a1 =
		json__parse<gapi.client.youtube.PlaylistItemListResponse[]>(
			text_cache?.data)
	const youtube_playlistItemListResponse_a1:gapi.client.youtube.PlaylistItemListResponse[] = []
	await url__ready__wait(ctx)
	let page_idx = 0
	do {
		const url = url_(ctx)
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
	text_cache__upsert(
		ctx,
		text_cache_id,
		{
			data: JSON.stringify(youtube_playlistItemListResponse_a1),
			etag: youtube_playlistItemListResponse_a1[0]?.etag
		})
	$._ = youtube_playlistItemListResponse_a1
}
function url__ready__wait(ctx:wide_ctx_T&wide_app_ctx_T) {
	return rmemo__wait(()=>youtube_channelList_playlistId_(ctx), I, 5_000)
}
function url_(ctx:wide_ctx_T&wide_app_ctx_T) {
	const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50')
	url.searchParams.set('playlistId', youtube_channelList_playlistId_(ctx)!)
	url.searchParams.set('key', google_api_key_(ctx))
	return url
}
