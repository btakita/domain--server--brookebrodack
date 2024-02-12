import { youtube_video } from '@rappstack/domain--server--youtube/schema'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { compact } from 'ctx-core/all'
import { id_be_memo_pair_, nullish__none_, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import { brookebrodack_youtube_rss_text_cache_ } from './brookebrodack_youtube_rss_text_cache.js'
export const [
	brookebrodack_youtube_video_a1$_,
	brookebrodack_youtube_video_a1_,
] = id_be_memo_pair_<
	typeof youtube_video.$inferSelect[]|null,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>(
	'brookebrodack_youtube_video_a1',
	(ctx, brookebrodack_youtube_video_a1$)=>
		nullish__none_([brookebrodack_youtube_rss_text_cache_(ctx)],
			brookebrodack_youtube_rss_text_cache=>{
				const db = drizzle_db_(ctx)
				const [up_to_date] =
					db.select()
						.from(youtube_video)
						.where(eq(youtube_video.create_ms, brookebrodack_youtube_rss_text_cache.create_ms))
						.limit(1)
						.all()
				if (!up_to_date) {
					console.info('brookebrodack_youtube_video_a1|CACHE MISS')
					upsert()
						.then(brookebrodack_youtube_video_a1=>{
							brookebrodack_youtube_video_a1$._ = compact(
								brookebrodack_youtube_video_a1) as typeof youtube_video.$inferSelect[]
						})
					return null
				}
				return (
					db.select()
						.from(youtube_video)
						.all()
				)
				async function upsert():Promise<(typeof youtube_video.$inferSelect|null)[]> {
					let _youtube_video:Partial<typeof youtube_video.$inferSelect> = {}
					const rewriter = new HTMLRewriter()
					rewriter.on('videoId', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.videoId = el.text
						}
					})
					rewriter.on('entry channelId', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.channelId = el.text
						}
					})
					rewriter.on('entry author name', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.author_name = el.text
						}
					})
					rewriter.on('entry author uri', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.author_uri = el.text
						}
					})
					rewriter.on('entry published', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.published_ms = new Date(el.text)
						}
					})
					rewriter.on('entry updated', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.updated_ms = new Date(el.text)
						}
					})
					rewriter.on('entry title', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.title = el.text
						}
					})
					rewriter.on('entry thumbnail', {
						element(el) {
							_youtube_video.thumbnail = el.getAttribute('url')!
						}
					})
					rewriter.on('entry description', {
						text(el) {
							if (!el.lastInTextNode) _youtube_video.description = el.text
						}
					})
					const brookebrodack_youtube_video_promise_a1:Promise<typeof youtube_video.$inferSelect|null>[] = []
					let count = 0
					rewriter.on('entry', {
						element(el) {
							brookebrodack_youtube_video_promise_a1.push(
								new Promise(resolve=>{
									el.onEndTag(()=>{
										if (
											_youtube_video.videoId
											&& _youtube_video.channelId
											&& _youtube_video.author_name
											&& _youtube_video.author_uri
											&& _youtube_video.title
											&& _youtube_video.thumbnail
										) {
											_youtube_video.create_ms = brookebrodack_youtube_rss_text_cache.create_ms
											const __youtube_video_a1 =
												db.insert(youtube_video)
													.values(_youtube_video as typeof youtube_video.$inferSelect)
													.onConflictDoUpdate({
														target: youtube_video.videoId,
														set: _youtube_video
													})
													.returning()
													.all()
											resolve((__youtube_video_a1 as never)[0] as typeof youtube_video.$inferSelect)
										}
										else {
											console.warn('brookebrodack_youtube_video_a1|entry|onEndTag|missing props', {
												videoId: _youtube_video.videoId,
												count: ++count,
												_youtube_video,
											})
											resolve(null)
										}
										_youtube_video = {}
									})
								})
							)
						}
					})
					const response = rewriter.transform(
						new Response(
							brookebrodack_youtube_rss_text_cache.data
								.replaceAll('<yt:', '<')
								.replaceAll('</yt:', '</')
								.replaceAll('<media:', '<')
								.replaceAll('</media:', '</')
						))
					await consume(response.body!)
					return Promise.all(brookebrodack_youtube_video_promise_a1)
				}
			}))
async function consume(stream:ReadableStream) {
	const reader = stream.getReader()
	while (!(await reader.read()).done) { /* NOOP */
	}
}
