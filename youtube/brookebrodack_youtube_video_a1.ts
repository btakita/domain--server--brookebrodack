import { youtube_video } from '@rappstack/domain--server--youtube/schema'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { compact, rmemo__wait } from 'ctx-core/all'
import { id_be_memo_pair_, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import {
	brookebrodack_youtube_rss_text_cache$_,
	brookebrodack_youtube_rss_text_cache_meta_
} from './brookebrodack_youtube_rss_text_cache.js'
export const [
	brookebrodack_youtube_video_a1$_,
	brookebrodack_youtube_video_a1_,
] = id_be_memo_pair_<
	typeof youtube_video.$inferSelect[]|null,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>(
	'brookebrodack_youtube_video_a1',
	(ctx, brookebrodack_youtube_video_a1$)=>{
		const brookebrodack_youtube_rss_text_cache_meta = brookebrodack_youtube_rss_text_cache_meta_(ctx)
		const db = drizzle_db_(ctx)
		const up_to_date = !!(
			brookebrodack_youtube_rss_text_cache_meta
			&& db.select()
				.from(youtube_video)
				.where(eq(youtube_video.create_ms, brookebrodack_youtube_rss_text_cache_meta.create_ms))
				.limit(1)
				.all()[0])
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
			rewriter
				.on('videoId', text_ontext_('videoId'))
				.on('entry channelId', text_ontext_('channelId'))
				.on('entry author name', text_ontext_('author_name'))
				.on('entry author uri', text_ontext_('author_uri'))
				.on('entry published', date_ontext_('published_ms'))
				.on('entry updated', date_ontext_('updated_ms'))
				.on('entry title', text_ontext_('title'))
				.on('entry thumbnail', {
					element(el) {
						_youtube_video.thumbnail = el.getAttribute('url')!
					}
				})
				.on('entry description', text_ontext_('description'))
			const brookebrodack_youtube_video_promise_a1:Promise<typeof youtube_video.$inferSelect|null>[] = []
			let count = 0
			rewriter.on('entry', {
				element(el) {
					brookebrodack_youtube_video_promise_a1.push(
						new Promise(resolve=>{
							el.onEndTag(async ()=>{
								if (
									_youtube_video.videoId
									&& _youtube_video.channelId
									&& _youtube_video.author_name
									&& _youtube_video.author_uri
									&& _youtube_video.title
									&& _youtube_video.thumbnail
								) {
									const local__youtube_video = _youtube_video
									rmemo__wait(
										brookebrodack_youtube_rss_text_cache$_(ctx),
										brookebrodack_youtube_rss_text_cache=>brookebrodack_youtube_rss_text_cache,
										10_000
									).then(brookebrodack_youtube_rss_text_cache=>{
										local__youtube_video.create_ms = brookebrodack_youtube_rss_text_cache!.create_ms
										const upsert__youtube_video_a1 =
											db.insert(youtube_video)
												.values(local__youtube_video as typeof youtube_video.$inferSelect)
												.onConflictDoUpdate({
													target: youtube_video.videoId,
													set: local__youtube_video
												})
												.returning()
												.all()
										resolve((upsert__youtube_video_a1 as never)[0] as typeof youtube_video.$inferSelect)
									}).catch(err=>{
										console.error(err)
										resolve(null)
									})
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
			const brookebrodack_youtube_rss_text_cache =
				(await rmemo__wait(
					brookebrodack_youtube_rss_text_cache$_(ctx),
					brookebrodack_youtube_rss_text_cache=>brookebrodack_youtube_rss_text_cache,
					10_000))!
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
			function text_ontext_(key:Exclude<keyof typeof _youtube_video, 'create_ms'|'published_ms'|'updated_ms'>) {
				return {
					text(el:HTMLRewriterTypes.Text) {
						if (!el.lastInTextNode) _youtube_video[key] = el.text
					}
				}
			}
			function date_ontext_(key:Extract<keyof typeof _youtube_video, 'create_ms'|'published_ms'|'updated_ms'>) {
				return {
					text(el:HTMLRewriterTypes.Text) {
						if (!el.lastInTextNode) _youtube_video[key] = new Date(el.text)
					}
				}
			}
		}
	})
async function consume(stream:ReadableStream) {
	const reader = stream.getReader()
	while (!(await reader.read()).done) { /* NOOP */
	}
}
