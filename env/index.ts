export function domain_server_brookebrodack_env_() {
	const env = import.meta.env
	if (!env.GOOGLE_API_KEY) throw Error('GOOGLE_API_KEY|missing')
	if (!env.YOUTUBE_CHANNELID) throw Error('YOUTUBE_CHANNELID|missing')
	if (!env.AUTHORY_YOUTUBE_RSS_URL) throw Error('AUTHORY_YOUTUBE_RSS_URL|missing')
	if (!env.YOUTUBE_RSS_URL) throw Error('YOUTUBE_RSS_URL|missing')
	return env as domain_server_brookebrodack_env_T
}
export type domain_server_brookebrodack_env_T = {
	GOOGLE_API_KEY:string
	YOUTUBE_CHANNELID:string
	YOUTUBE_RSS_URL:string
	AUTHORY_YOUTUBE_RSS_URL:string
}
