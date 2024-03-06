import { I } from 'ctx-core/combinators'
import { id_be_memo_pair_, nullish__none_, rmemo__wait, type wide_ctx_T } from 'ctx-core/rmemo'
import { youtube_playlistItemListResponse_a1_ } from './youtube_playlistItemListResponse_a1.js'
export const [
	,
	youtube_playlistItem_a1_
] = id_be_memo_pair_('youtube_playlistItemList_o', (ctx:wide_ctx_T<''|'app'>)=>
	nullish__none_([youtube_playlistItemListResponse_a1_(ctx)],
		youtube_playlistItemListResponse_a1=>
			youtube_playlistItemListResponse_a1
				.flatMap(youtube_playlistItemListResponse=>
					youtube_playlistItemListResponse.items!)
				.filter(youtube_playlistItem=>youtube_playlistItem.status?.privacyStatus !== 'private')))
export function youtube_playlistItem_a1__wait(ctx:wide_ctx_T<''|'app'>, timeout?:number) {
	return rmemo__wait(()=>youtube_playlistItem_a1_(ctx), I, timeout ?? 10_000)
}
