import { createTransaction } from 'api';

import { CONTENT_TYPES, TAGS } from 'helpers/config';

export async function followAddress(args: { address: string }): Promise<string | null> {
	try {
		const txId = await createTransaction({
			content: TAGS.values.followDataProtocol,
			contentType: CONTENT_TYPES.textPlain,
			tags: [
				{ name: TAGS.keys.dataProtocol, value: TAGS.values.followDataProtocol },
				{ name: TAGS.keys.target, value: args.address },
			],
		});
		return txId;
	} catch (e: any) {
		console.error(e);
		return null;
	}
}
