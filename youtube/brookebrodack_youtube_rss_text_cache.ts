import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { text_cache } from '@rappstack/domain--server/schema'
import { id_be_memo_pair_, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq, sql } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
export const brookebrodack_youtube_rss__url = 'http://www.youtube.com/feeds/videos.xml?channel_id=UCO42ciP_nkDcOlATRjLXCqQ'
// 1 hour
const cache_ttl_ms = 60 * 3600 * 1000
export const [
	brookebrodack_youtube_rss_text_cache$_,
	brookebrodack_youtube_rss_text_cache_,
] = id_be_memo_pair_<
	typeof text_cache.$inferSelect|null,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>(
	'brookebrodack_youtube_rss',
	(ctx, brookebrodack_youtube_rss$)=>{
		const db = drizzle_db_(ctx)
		const rss_text_cache =
			db.select()
				.from(text_cache)
				.where(eq(text_cache.text_cache_id, brookebrodack_youtube_rss__url))
				.limit(1)
				.all()[0]
		if (
			!rss_text_cache?.text_cache_id
			|| rss_text_cache.validate_ms.getTime() + cache_ttl_ms < new Date().getTime()
		) {
			run(async ()=>{
				const response = await fetch(brookebrodack_youtube_rss__url)
				const rss = await response.text()
				const brookebrodack_youtube_rss_text_cache = db.insert(text_cache)
					.values({
						text_cache_id: brookebrodack_youtube_rss__url,
						data: rss
					}).onConflictDoUpdate({
						target: text_cache.text_cache_id,
						set: {
							...(
								rss !== rss_text_cache?.data
									? {
										create_ms: sql`CURRENT_TIMESTAMP`,
										data: rss
									}
									: null),
							validate_ms: sql`CURRENT_TIMESTAMP`,
						}
					})
					.returning()
					.get()
				brookebrodack_youtube_rss$._ = brookebrodack_youtube_rss_text_cache
			}).then()
			return null
		}
		return rss_text_cache
	})
