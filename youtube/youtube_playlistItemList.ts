import { id_be_memo_pair_, type nullish, nullish__none_, type wide_ctx_T } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
import { youtube_playlistItemListResponse_a1_ } from './youtube_playlistItemListResponse_a1.js'
export const [
	,
	youtube_playlistItemList_
] = id_be_memo_pair_<
	gapi.client.youtube.PlaylistItem[]|nullish,
	unknown,
	wide_ctx_T&wide_app_ctx_T
>('youtube_playlistItemList',
	(ctx:wide_ctx_T&wide_app_ctx_T)=>
		nullish__none_([youtube_playlistItemListResponse_a1_(ctx)],
			youtube_playlistItemListResponse_a1=>
				youtube_playlistItemListResponse_a1.flatMap(youtube_playlistItemListResponse=>
					youtube_playlistItemListResponse.items!)))
