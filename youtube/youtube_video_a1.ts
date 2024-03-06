import { youtube_video_tbl } from '@rappstack/domain--server--youtube/schema'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { I } from 'ctx-core/combinators'
import { id_be_memo_pair_, rmemo__wait, type wide_ctx_T } from 'ctx-core/rmemo'
import { eq, sql } from 'drizzle-orm'
import { youtube_playlistItem_a1_ } from './youtube_playlistItemList.js'
import { youtube_playlistItemListResponse_etag_ } from './youtube_playlistItemListResponse_a1.js'
export const [
	,
	youtube_video_a1_
] = id_be_memo_pair_<
	typeof youtube_video_tbl.$inferSelect[]|undefined,
	unknown,
	wide_ctx_T<''|'app'>
>('youtube_video_a1', (ctx, $)=>{
	const youtube_playlistItemListResponse_etag = youtube_playlistItemListResponse_etag_(ctx)
	if (youtube_playlistItemListResponse_etag === undefined) return
	const db = drizzle_db_(ctx)
	if (
		youtube_playlistItemListResponse_etag
		&& db.select()
			.from(youtube_video_tbl)
			.where(eq(youtube_video_tbl.playlistItemListResponse_etag, youtube_playlistItemListResponse_etag))
			.limit(1)
			.all()
			.length
	) {
		return db.select().from(youtube_video_tbl).all()
	}
	Promise.all([
		rmemo__wait(()=>youtube_playlistItem_a1_(ctx), I, 10_000),
		rmemo__wait(()=>youtube_playlistItemListResponse_etag_(ctx), I, 10_000)
	]).then(([youtube_playlistItem_a1, youtube_playlistItemListResponse_etag])=>{
		$._ = db.insert(youtube_video_tbl)
			.values(youtube_playlistItem_a1.map(playlistItem=>({
				videoId: playlistItem.snippet!.resourceId!.videoId!,
				publishedAt: new Date(playlistItem.snippet!.publishedAt!),
				channelId: playlistItem.snippet!.channelId!,
				channelTitle: playlistItem.snippet!.channelTitle!,
				title: playlistItem.snippet!.title!,
				description: playlistItem.snippet!.description!,
				etag: playlistItem.etag!,
				playlistItemListResponse_etag: youtube_playlistItemListResponse_etag
			})))
			.onConflictDoUpdate({
				target: youtube_video_tbl.videoId,
				set: {
					publishedAt: sql`excluded.publishedAt`,
					channelId: sql`excluded.channelId`,
					channelTitle: sql`excluded.channelTitle`,
					title: sql`excluded.title`,
					description: sql`excluded.description`,
					etag: sql`excluded.etag`,
					playlistItemListResponse_etag: sql`excluded.playlistItemListResponse_etag`,
				}
			})
			.returning()
			.all() as typeof youtube_video_tbl.$inferSelect[]
	}).catch(err=>console.error(err))
	return $.val
})
