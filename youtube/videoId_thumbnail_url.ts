export const thumbnail_size_R_thumbnail_o = {
	'default': {
		'basename': 'default.jpg',
		'width': 120,
		'height': 90
	},
	'medium': {
		'basename': 'mqdefault.jpg',
		'width': 320,
		'height': 180
	},
	'high': {
		'basename': 'hqdefault.jpg',
		'width': 480,
		'height': 360
	},
	'standard': {
		'basename': 'sddefault.jpg',
		'width': 640,
		'height': 480
	},
	'maxres': {
		'basename': 'maxresdefault.jpg',
		'width': 1280,
		'height': 720
	}
}
export function videoId_thumbnail_url_(
	videoId:string,
	size?:keyof thumbnail_size_R_thumbnail_o_T
) {
	return 'https://img.youtube.com/vi/' + videoId + '/' + thumbnail_size_R_thumbnail_o[size ?? 'standard'].basename
}
export type thumbnail_size_R_thumbnail_o_T = {
	default:thumbnail_o_T
	medium:thumbnail_o_T
	high:thumbnail_o_T
	standard:thumbnail_o_T
	maxres:thumbnail_o_T
}
export type thumbnail_o_T = {
	basename:string
	width:number
	height:number
}
