import { youtube_video } from '@rappstack/domain--server--youtube/schema'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { compact } from 'ctx-core/array'
import { id_be_memo_pair_, rmemo__wait, type wide_ctx_T } from 'ctx-core/rmemo'
import { desc, eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import {
	youtube_rss_cache_,
	youtube_rss_cache_meta_
} from './youtube_rss_cache.js'
export const [
	,
	/** @see {import('@btakita/ui--server--brookebrodack/content').content__doc_html_} */
	youtube_video_a1_,
] = id_be_memo_pair_<
	typeof youtube_video.$inferSelect[]|null,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>(
	'youtube_video_a1',
	(ctx, youtube_video_a1$)=>{
		const youtube_rss_cache_meta = youtube_rss_cache_meta_(ctx)
		const db = drizzle_db_(ctx)
		const up_to_date = !!(
			youtube_rss_cache_meta
			&& db.select()
				.from(youtube_video)
				.where(eq(youtube_video.create_ms, youtube_rss_cache_meta.create_ms))
				.orderBy(desc(youtube_video.published_ms))
				.limit(1)
				.all()[0])
		if (!up_to_date) {
			console.info('brookebrodack_youtube_video_a1|CACHE MISS')
			upsert()
				.then(brookebrodack_youtube_video_a1=>{
					youtube_video_a1$._ = compact(
						brookebrodack_youtube_video_a1) as typeof youtube_video.$inferSelect[]
				})
				.catch(err=>{
					console.error(err)
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
										()=>youtube_rss_cache_(ctx),
										youtube_rss_cache=>youtube_rss_cache,
										10_000
									).then(youtube_rss_cache=>{
										local__youtube_video.create_ms = youtube_rss_cache!.create_ms
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
								} else {
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
			const youtube_rss_cache =
				(await rmemo__wait(
					()=>youtube_rss_cache_(ctx),
					youtube_rss_cache=>youtube_rss_cache,
					10_000))!
			const response = rewriter.transform(
				new Response(
					youtube_rss_cache.data
						// HTMLRewriter does not support xml tags with a namespace.
						// TODO: Remove these replaceAll calls when using a parser that supports xml tags with a namespace
						.replaceAll('<yt:', '<')
						.replaceAll('</yt:', '</')
						.replaceAll('<media:', '<')
						.replaceAll('</media:', '</')))
			const reader = response.body!.getReader()
			while (!(await reader.read()).done) { /* NOOP */
			}
			return Promise.all(brookebrodack_youtube_video_promise_a1)
			function text_ontext_(key:Exclude<keyof typeof _youtube_video, 'create_ms'|'published_ms'|'updated_ms'>) {
				return {
					text(el:HTMLRewriterTypes.Text) {
						_youtube_video[key] ??= ''
						_youtube_video[key] += el.text ?? ''
					}
				}
			}
			function date_ontext_(key:Extract<keyof typeof _youtube_video, 'create_ms'|'published_ms'|'updated_ms'>) {
				return {
					text(el:HTMLRewriterTypes.Text) {
						if (el.text) {
							_youtube_video[key] = new Date(el.text)
						}
					}
				}
			}
		}
	})
