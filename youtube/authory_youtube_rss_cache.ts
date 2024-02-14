import { text_cache } from '@rappstack/domain--server/schema'
import { text_cache__select, text_cache__upsert, text_cache_meta__select } from '@rappstack/domain--server/text_cache'
import { id_be_memo_pair_, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
import { youtube_rss_cache_meta_ } from './youtube_rss_cache.js'
export const authory_youtube_rss_url = 'https://authory.com/BrianTakita/rss?collection=c787747f07ffd40cca1c1863b640f9e24'
// 1 hour
const cache_ttl_ms = 60 * 3600 * 1000
export const [
	,
	authory_youtube_rss_cache_meta_
] = id_be_memo_pair_(
	'authory_youtube_rss_cache_meta',
	(ctx:wide_ctx_T&wide_app_ctx_T)=>
		text_cache_meta__select(ctx, authory_youtube_rss_url))
export const [
	,
	authory_youtube_rss_cache_,
] = id_be_memo_pair_<
	typeof text_cache.$inferSelect|null,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('authory_youtube_rss_cache',
	(ctx, authory_youtube_rss_cache$)=>{
		const youtube_rss_cache_meta = youtube_rss_cache_meta_(ctx)
		if (
			!youtube_rss_cache_meta?.text_cache_id
			|| youtube_rss_cache_meta.validate_ms.getTime() + cache_ttl_ms < new Date().getTime()
		) {
			run(async ()=>{
				const response = await fetch(authory_youtube_rss_url)
				const rss = await response.text()
				authory_youtube_rss_cache$._ = await text_cache__upsert(ctx, authory_youtube_rss_url, rss)
			}).catch(err=>console.error(err))
			return null
		}
		return text_cache__select(ctx, authory_youtube_rss_url)
	})
