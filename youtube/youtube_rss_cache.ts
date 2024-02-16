import { text_cache_tbl } from '@rappstack/domain--server/schema'
import { text_cache__select, text_cache__upsert, text_cache_meta__select } from '@rappstack/domain--server/text_cache'
import { ms_ } from 'ctx-core/date'
import { id_be_memo_pair_, type nullish, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
import { domain_server_brookebrodack_env_ } from '../env/index.js'
// 1 hour
const cache_ttl_ms = 60 * 3600 * 1000
export const [
	,
	/** @see {import('./youtube_video_a1.js').youtube_video_a1_} */
	youtube_rss_cache_meta_
] = id_be_memo_pair_(
	'youtube_rss_cache_meta',
	(ctx:wide_ctx_T&wide_app_ctx_T)=>
		text_cache_meta__select(ctx, domain_server_brookebrodack_env_().YOUTUBE_RSS_URL))
export const [
	,
	/** @see {import('./youtube_video_a1.js').youtube_video_a1_} */
	youtube_rss_cache_,
] = id_be_memo_pair_<
	typeof text_cache_tbl.$inferSelect|nullish,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('youtube_rss_cache',
	(ctx, $)=>{
		const youtube_rss_cache_meta = youtube_rss_cache_meta_(ctx)
		const { YOUTUBE_RSS_URL } = domain_server_brookebrodack_env_()
		if (
			!youtube_rss_cache_meta?.text_cache_id
			|| ms_(youtube_rss_cache_meta.validate_dts) + cache_ttl_ms < ms_(new Date())
		) {
			run(async ()=>{
				const response = await fetch(YOUTUBE_RSS_URL)
				if (!response.ok) {
					console.warn('youtube_rss_cache|' + response.status)
					$._ = text_cache__select(ctx, YOUTUBE_RSS_URL)
					return
				}
				const data = await response.text()
				$._ = await text_cache__upsert(ctx, YOUTUBE_RSS_URL, { data })
			}).catch(err=>console.error(err))
			return null
		}
		return text_cache__select(ctx, YOUTUBE_RSS_URL)
	})
