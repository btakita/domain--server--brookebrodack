/// <reference types="@types/gapi.client.youtube-v3" />
import { active_text_cache_, text_cache__select, text_cache__upsert } from '@rappstack/domain--server/text_cache'
import { json__parse } from 'ctx-core/json'
import { id_be_memo_pair_, type nullish, nullish__none_, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
import { domain_server_brookebrodack_env_ } from '../env/index.js'
const ttl_ms = Infinity
const text_cache_id = 'youtube#channelListResponse'
export const [
	,
	youtube_channelListResponse_
] = id_be_memo_pair_<gapi.client.youtube.ChannelListResponse|nullish, unknown, wide_ctx_T&wide_app_ctx_T>(
	'youtube_channelListResponse',
	(ctx, $)=>{
		const { GOOGLE_API_KEY, YOUTUBE_CHANNELID } = domain_server_brookebrodack_env_()
		const text_cache = text_cache__select(ctx, text_cache_id)
		const youtube_channelListResponse = json__parse<
			gapi.client.youtube.ChannelListResponse
		>(active_text_cache_(text_cache, { ttl_ms })?.data)
		if (!youtube_channelListResponse) {
			run(async ()=>{
				const cache_etag = text_cache?.etag
				const response = await fetch(
					`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNELID}&key=${GOOGLE_API_KEY}`,
					{
						headers: cache_etag ? { 'If-None-Match': cache_etag } : undefined
					})
				if (!response.ok) {
					console.warn('youtube_channelListResponse|GET|' + response.status)
					$._ = json__parse<gapi.client.youtube.ChannelListResponse>(text_cache?.data)
					return
				}
				const is_cache_status = response.status === 304
				const payload = is_cache_status ? null : await response.json()
				$._ = json__parse(
					text_cache__upsert(ctx, text_cache_id, {
						data: is_cache_status ? text_cache.data : JSON.stringify(payload),
						etag: is_cache_status ? text_cache.etag ?? undefined : payload.etag
					}).data)
			}).catch(err=>console.error(err))
			return null
		}
		return youtube_channelListResponse
	})
export const [
	,
	/** @see {youtube_playlistItemListResponse_etag_} */
	youtube_channelList_playlistId_
] = id_be_memo_pair_('youtube_channelList_playlistId',
	(ctx:wide_ctx_T&wide_app_ctx_T)=>
		nullish__none_([youtube_channelListResponse_(ctx)],
			youtube_channelListResponse=>
				youtube_channelListResponse.items?.[0].contentDetails?.relatedPlaylists?.uploads))
