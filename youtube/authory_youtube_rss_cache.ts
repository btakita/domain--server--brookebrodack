import { text_cache_tbl } from '@rappstack/domain--server/schema'
import { text_cache__select, text_cache__upsert, text_cache_meta__select } from '@rappstack/domain--server/text_cache'
import { ms_ } from 'ctx-core/date'
import { id_be_memo_pair_, type nullish, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
import { domain_server_brookebrodack_env_ } from '../env/index.js'
import { youtube_rss_cache_meta_ } from './youtube_rss_cache.js'
// 1 hour
const cache_ttl_ms = 60 * 3600 * 1000
export const [
	,
	authory_youtube_rss_cache_meta_
] = id_be_memo_pair_('authory_youtube_rss_cache_meta', (ctx:wide_ctx_T&wide_app_ctx_T)=>
	text_cache_meta__select(ctx, domain_server_brookebrodack_env_().AUTHORY_YOUTUBE_RSS_URL))
export const [
	,
	authory_youtube_rss_cache_,
] = id_be_memo_pair_<
	typeof text_cache_tbl.$inferSelect|nullish,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('authory_youtube_rss_cache', (ctx, $)=>{
	const { AUTHORY_YOUTUBE_RSS_URL } = domain_server_brookebrodack_env_()
	const youtube_rss_cache_meta = youtube_rss_cache_meta_(ctx)
	if (
		!youtube_rss_cache_meta?.text_cache_id
		|| ms_(youtube_rss_cache_meta.validate_dts) + cache_ttl_ms < ms_(new Date())
	) {
		run(async ()=>{
			const response = await fetch(AUTHORY_YOUTUBE_RSS_URL)
			if (!response.ok) {
				console.warn('authory_youtube_rss_cache|' + response.status)
				$._ = text_cache__select(ctx, AUTHORY_YOUTUBE_RSS_URL)
				return
			}
			const data = await response.text()
			$._ = text_cache__upsert(ctx, AUTHORY_YOUTUBE_RSS_URL, { data })
		}).catch(err=>console.error(err))
		return null
	}
	return text_cache__select(ctx, AUTHORY_YOUTUBE_RSS_URL)
})
