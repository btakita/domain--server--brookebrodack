/// <reference types="@types/gapi.client.youtube-v3" />
import { active_text_cache_, text_cache__select, text_cache__upsert } from '@rappstack/domain--server/text_cache'
import { json__parse } from 'ctx-core/json'
import { id_be_memo_pair_, type nullish, run, type wide_ctx_T } from 'ctx-core/rmemo'
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
				const response = await fetch(
					`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNELID}&key=${GOOGLE_API_KEY}`)
				if (!response.ok) {
					console.warn('youtube_channelListResponse|GET|' + response.status)
					$._ = json__parse<gapi.client.youtube.ChannelListResponse>(text_cache?.data)
					return
				}
				const payload = await response.json()
				$._ = await text_cache__upsert(ctx, text_cache_id, {
					data: JSON.stringify(payload),
					etag: payload.etag
				})
					.then(_text_cache=>json__parse<gapi.client.youtube.ChannelListResponse>(_text_cache.data))
					.catch(err=>{
						console.error(err)
						return null
					})
			}).catch(err=>console.error(err))
			return null
		}
		return youtube_channelListResponse
	})
