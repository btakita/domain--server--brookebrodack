import { youtube_video_tbl } from '@rappstack/domain--server--youtube/schema'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { type text_cache_meta_T } from '@rappstack/domain--server/text_cache'
import { I } from 'ctx-core/combinators'
import { id_be_memo_pair_, type nullish, rmemo__wait, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import { authory_youtube_rss_cache_ } from './authory_youtube_rss_cache.js'
import { youtube_rss_cache_, youtube_rss_cache_meta_ } from './youtube_rss_cache.js'
export const [
	,
	/** @see {import('@btakita/ui--server--brookebrodack/content').content__doc_html_} */
	rss_youtube_video_a1_,
] = id_be_memo_pair_<
	typeof youtube_video_tbl.$inferSelect[]|null,
	unknown,
	wide_ctx_T<''|'app'>
>('youtube_video_a1',
	(ctx, youtube_video_a1$)=>{
		const db = drizzle_db_(ctx)
		const youtube_rss_cache_meta = youtube_rss_cache_meta_(ctx)
		const youtube__up_to_date = text_cache__up_to_date_(ctx, youtube_rss_cache_meta)
		const authory_youtube_rss_cache_meta = authory_youtube_rss_cache_(ctx)
		const authory__up_to_date = text_cache__up_to_date_(ctx, authory_youtube_rss_cache_meta)
		if (!youtube__up_to_date || !authory__up_to_date) {
			console.info('youtube_video_a1|CACHE MISS')
			Promise.all([
				youtube__youtube_video_a1_(),
			]).then(([
				youtube__youtube_video_a1,
			])=>{
				const videoId_M_youtube_video = new Map<string, typeof youtube_video_tbl.$inferSelect>
				const youtube_video_a1:typeof youtube_video_tbl.$inferSelect[] = []
				for (const youtube__youtube_video of youtube__youtube_video_a1) {
					if (youtube__youtube_video) {
						videoId_M_youtube_video.set(youtube__youtube_video.videoId, youtube__youtube_video)
					}
				}
				for (const _youtube_video of videoId_M_youtube_video.values()) {
					youtube_video_a1.push(
						db.insert(youtube_video_tbl)
							.values(_youtube_video)
							.onConflictDoUpdate({
								target: youtube_video_tbl.videoId,
								set: _youtube_video
							})
							.returning()
							.all()[0])
				}
				youtube_video_a1$._ = youtube_video_a1
			}).catch(err=>console.error(err))
			return null
		}
		return (
			db.select()
				.from(youtube_video_tbl)
				.all()
		)
		async function youtube__youtube_video_a1_():Promise<(typeof youtube_video_tbl.$inferSelect|null)[]> {
			let _youtube_video:Partial<typeof youtube_video_tbl.$inferSelect> = {}
			const rewriter = new HTMLRewriter()
			rewriter
				.on('videoId', text_ontext_('videoId'))
				.on('entry channelId', text_ontext_('channelId'))
				.on('entry author name', text_ontext_('channelTitle'))
				.on('entry published', date_ontext_('publishedAt'))
				.on('entry title', text_ontext_('title'))
				.on('entry description', text_ontext_('description'))
			const youtube_video_promise_a1:Promise<typeof youtube_video_tbl.$inferSelect|null>[] = []
			let count = 0
			rewriter.on('entry', {
				element(el) {
					youtube_video_promise_a1.push(
						new Promise(resolve=>{
							el.onEndTag(async ()=>{
								if (
									_youtube_video.videoId
									&& _youtube_video.channelId
									&& _youtube_video.channelTitle
									&& _youtube_video.title
								) {
									const local__youtube_video = _youtube_video
									rmemo__wait(
										()=>youtube_rss_cache_(ctx),
										youtube_rss_cache=>youtube_rss_cache,
										10_000
									).then(youtube_rss_cache=>{
										local__youtube_video.create_dts = youtube_rss_cache!.create_dts
										resolve(local__youtube_video as typeof youtube_video_tbl.$inferSelect)
									}).catch(err=>{
										console.error(err)
										resolve(null)
									})
								} else {
									console.warn('youtube_video_a1|entry|onEndTag|missing props', {
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
			const youtube_rss_cache = (
				await rmemo__wait(
					()=>youtube_rss_cache_(ctx),
					I,
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
			return Promise.all(youtube_video_promise_a1)
			function text_ontext_(key:Exclude<keyof typeof _youtube_video, 'create_dts'|'publishedAt'|'updatedAt'>) {
				return {
					text(el:HTMLRewriterTypes.Text) {
						_youtube_video[key] ??= ''
						_youtube_video[key] += el.text ?? ''
					}
				}
			}
			function date_ontext_(key:Extract<keyof typeof _youtube_video, 'create_dts'|'publishedAt'|'updatedAt'>) {
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
function text_cache__up_to_date_(
	ctx:wide_app_ctx_T,
	text_cache_meta:text_cache_meta_T|nullish
) {
	return !!(
		text_cache_meta
		&& drizzle_db_(ctx).select()
			.from(youtube_video_tbl)
			.where(eq(youtube_video_tbl.create_dts, text_cache_meta.create_dts))
			.limit(1)
			.all()[0])
}
