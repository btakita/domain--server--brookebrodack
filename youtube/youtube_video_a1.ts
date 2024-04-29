import { youtube_video_tbl } from '@rappstack/domain--server--youtube/schema'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { id_be_memo_pair_, type wide_ctx_T } from 'ctx-core/rmemo'
import { desc, eq, sql } from 'drizzle-orm'
import { youtube_playlistItem_a1__wait } from './youtube_playlistItemList.js'
import {
	youtube_playlistItemListResponse_etag_,
	youtube_playlistItemListResponse_etag__wait
} from './youtube_playlistItemListResponse_a1.js'
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
	if (youtube_playlistItemListResponse_etag) {
		const db__youtube_video_a1 = db.select()
			.from(youtube_video_tbl)
			.where(eq(youtube_video_tbl.playlistItemListResponse_etag, youtube_playlistItemListResponse_etag))
			.orderBy(desc(youtube_video_tbl.publishedAt))
			.all()
		if (db__youtube_video_a1.length) return db__youtube_video_a1
	}
	Promise.all([
		youtube_playlistItem_a1__wait(ctx),
		youtube_playlistItemListResponse_etag__wait(ctx)
	]).then(([youtube_playlistItem_a1, youtube_playlistItemListResponse_etag])=>{
		$.set(<typeof youtube_video_tbl.$inferSelect[]>
			db.insert(youtube_video_tbl)
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
				.all())
	}).catch(err=>console.error(err))
	return $.val
})
