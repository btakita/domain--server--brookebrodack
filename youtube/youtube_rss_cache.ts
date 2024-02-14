import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { text_cache } from '@rappstack/domain--server/schema'
import { id_be_memo_pair_, run, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq, sql } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
export const brookebrodack_youtube_rss__url = 'http://www.youtube.com/feeds/videos.xml?channel_id=UCO42ciP_nkDcOlATRjLXCqQ'
// 1 hour
const cache_ttl_ms = 60 * 3600 * 1000
export const [
	,
	/** @see {import('./brookebrodack_youtube_video_a1.js').youtube_video_a1_} */
	youtube_rss_cache_meta_
] = id_be_memo_pair_(
	'youtube_rss_cache_meta',
	(ctx:wide_ctx_T&wide_app_ctx_T)=>
		drizzle_db_(ctx)
			.select({
				text_cache_id: text_cache.text_cache_id,
				create_ms: text_cache.create_ms,
				validate_ms: text_cache.validate_ms,
			})
			.from(text_cache)
			.where(eq(text_cache.text_cache_id, brookebrodack_youtube_rss__url))
			.limit(1)
			.all()[0]
)
export const [
	,
	/** @see {import('./brookebrodack_youtube_video_a1.js').youtube_video_a1_} */
	youtube_rss_cache_,
] = id_be_memo_pair_<
	typeof text_cache.$inferSelect|null,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>(
	'youtube_rss_cache',
	(ctx, youtube_rss_cache$)=>{
		const db = drizzle_db_(ctx)
		const brookebrodack_youtube_rss_text_cache_meta = youtube_rss_cache_meta_(ctx)
		if (
			!brookebrodack_youtube_rss_text_cache_meta?.text_cache_id
			|| brookebrodack_youtube_rss_text_cache_meta.validate_ms.getTime() + cache_ttl_ms < new Date().getTime()
		) {
			run(async ()=>{
				const response = await fetch(brookebrodack_youtube_rss__url)
				const rss = await response.text()
				const data_o = db.select({ data: text_cache.data })
					.from(text_cache)
					.where(eq(text_cache.text_cache_id, brookebrodack_youtube_rss__url))
					.limit(1)
					.all()[0]
				youtube_rss_cache$._ =
					db.insert(text_cache)
						.values({
							text_cache_id: brookebrodack_youtube_rss__url,
							data: rss
						})
						.onConflictDoUpdate({
							target: text_cache.text_cache_id,
							set: {
								...(
									rss !== data_o?.data
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
			}).then()
			return null
		}
		return db.select()
			.from(text_cache)
			.where(eq(text_cache.text_cache_id, brookebrodack_youtube_rss__url))
			.limit(1)
			.all()[0]
	})
