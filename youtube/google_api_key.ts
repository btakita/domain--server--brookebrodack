import { id_be_sig_triple_ } from 'ctx-core/rmemo'
import { brookebrodack_server_env_ } from '../env/index.js'
export const [
	,
	google_api_key_,
	google_api_key__set
] = id_be_sig_triple_('google_api_key',
	()=>brookebrodack_server_env_().GOOGLE_API_KEY)
