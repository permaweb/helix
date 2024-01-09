import { CURSORS, GATEWAYS, PAGINATORS } from 'helpers/config';
import { AGQLResponseType, GQLArgsType, GQLNodeResponseType } from 'helpers/types';

export async function getGQLData(args: GQLArgsType): Promise<AGQLResponseType> {
	const paginator = args.paginator ? args.paginator : PAGINATORS.default;

	let data: GQLNodeResponseType[] = [];
	let count: number = 0;
	let nextCursor: string | null = null;

	if (args.ids && !args.ids.length) {
		return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
	}

	try {
		const response = await fetch(`https://${args.gateway}/graphql`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: getQuery(args),
		});
		const responseJson = await response.json();
		if (responseJson.data.transactions.edges.length) {
			data = [...responseJson.data.transactions.edges];
			count = responseJson.data.transactions.count ?? 0;

			const lastResults: boolean = data.length < paginator || !responseJson.data.transactions.pageInfo.hasNextPage;

			if (lastResults) nextCursor = CURSORS.end;
			else nextCursor = data[data.length - 1].cursor;

			return {
				data: data,
				count: count,
				nextCursor: nextCursor,
				previousCursor: null,
			};
		} else {
			return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
		}
	} catch (e: any) {
		console.error(e);
		return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
	}
}

function getQuery(args: GQLArgsType): string {
	const paginator = args.paginator ? args.paginator : PAGINATORS.default;
	const ids = args.ids ? JSON.stringify(args.ids) : null;
	const tagFilters = args.tagFilters
		? JSON.stringify(args.tagFilters)
				.replace(/"([^"]+)":/g, '$1:')
				.replace(/"FUZZY_OR"/g, 'FUZZY_OR')
		: null;
	const owners = args.owners ? JSON.stringify(args.owners) : null;
	const cursor = args.cursor && args.cursor !== CURSORS.end ? `"${args.cursor}"` : null;

	let fetchCount: string = `first: ${paginator}`;
	let txCount: string = '';
	let nodeFields: string = `data { size type } owner { address } block { height timestamp }`;
	let order: string = '';

	switch (args.gateway) {
		case GATEWAYS.arweave:
			break;
		case GATEWAYS.goldsky:
			txCount = `count`;
			break;
	}

	const query = {
		query: `
                query {
                    transactions(
                        ids: ${ids},
                        tags: ${tagFilters},
						${fetchCount}
                        owners: ${owners},
                        after: ${cursor},
						${order}
						
                    ){
					${txCount}
					pageInfo {
						hasNextPage
					}
                    edges {
                        cursor
                        node {
                            id
                            tags {
                                name 
                                value 
                            }
							${nodeFields}
                        }
                    }
                }
            }
        `,
	};

	return JSON.stringify(query);
}

export * from './assets';
export * from './comments';
export * from './follow';
export * from './profiles';
export * from './search';
