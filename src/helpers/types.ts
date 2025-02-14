export type AssetType = {
	id: string;
	contentType: string;
	contentLength: number | null;
	title: string;
	description: string;
	type: string;
	topics: string[];
	creator: ProfileType;
	dateCreated: number;
	thumbnail: string;
	license: UDLType | null;
};

export type StampType = {
	total: number;
	vouched: number;
	connectedWalletStamped: boolean;
};

export type LicenseValueType = {
	value: string;
	icon?: string;
	endText?: string;
};

export type UDLType = {
	license: string | null;
	access: LicenseValueType | null;
	derivations: LicenseValueType | null;
	commercialUse: LicenseValueType | null;
	dataModelTraining: LicenseValueType | null;
	paymentMode: string | null;
	paymentAddress: string | null;
};

export enum CursorEnum {
	GQL = 'gql',
	IdGQL = 'idGql',
}

export type CursorObjectKeyType = CursorEnum.GQL | CursorEnum.IdGQL | null;

export type CursorObjectType = {
	key: CursorObjectKeyType;
	value: string;
};

export type TagFilterType = { name: string; values: string[]; match?: string };

export type GQLArgsType = {
	gateway: string;
	ids: string[] | null;
	tagFilters: TagFilterType[] | null;
	owners: string[] | null;
	cursor: string | null;
	reduxCursor: string | null;
	cursorObjectKey: CursorObjectKeyType;
	paginator?: number;
};

export type GQLNodeResponseType = {
	cursor: string | null;
	node: {
		id: string;
		tags: TagType[];
		data: {
			size: string;
			type: string;
		};
		block?: {
			height: number;
			timestamp: number;
		};
		owner?: {
			address: string;
		};
		address?: string;
		timestamp?: number;
	};
};

export type AGQLResponseType = {
	data: GQLNodeResponseType[];
	count: number;
	nextCursor: string | null;
	previousCursor: string | null;
};

export type AssetGQLResponseType = {
	data: AssetType[];
	count: number;
	nextCursor: string | null;
	previousCursor: string | null;
};

export type CommentGQLResponseType = {
	data: CommentType[];
	count: number;
	nextCursor: string | null;
	previousCursor: string | null;
};

export type AssetCreateArgsType = {
	content: any;
	contentType: string;
	title: string;
	description: string;
	type: string;
	topics: string[];
	owner: string;
	ticker: string;
	dataProtocol: string | null;
	dataSource: string | null;
	renderWith: string[] | null;
};

export type ProfileType = {
	txId: string;
	channelTitle: string | null;
	handle: string | null;
	avatar: string | null;
	walletAddress: string;
	profileIndex: string | null;
	banner: string | null;
};

export type FullProfileType = ProfileType & {
	bio: string;
};

export type CollectionType = {
	id: string;
	title: string;
	description: string | null;
	creator: string;
	dateCreated: string;
	banner: string | null;
	thumbnail: string | null;
};

export enum WalletEnum {
	arConnect = 'arConnect',
	arweaveApp = 'arweave.app',
	othent = 'othent',
	wander = 'wander',
}

export type TagType = { name: string; value: string };

export type ButtonType = 'primary' | 'alt1' | 'alt2';
export type RefType = { current: HTMLElement };
export type DateType = 'iso' | 'epoch';
export type NavPathType = { path: string; basePath?: string; label: string; icon: string };

export type SequenceType = {
	start: number;
	end: number;
};

export type CommentType = {
	id: string;
	data: string;
	dataSource: string;
	dateCreated: number;
	creator: ProfileType;
	stamps?: {
		total: number;
		vouched: number;
	};
};

export type FormFieldType = 'number' | 'password';
export type ValidationType = { status: boolean; message: string | null };

export type ReduxActionType = {
	type: string;
	payload: any;
};

export type FileMetadataType = { file: any; title: string; description: string };

export type UploadType = 'collection' | 'assets';

export type UploadPayloadType =
	| 'license'
	| 'title'
	| 'description'
	| 'collectionId'
	| 'collectionName'
	| 'collectionCode'
	| 'contentTokens'
	| 'useFractionalTokens'
	| 'transferableTokens'
	| 'topics'
	| 'renderer'
	| 'content'
	| 'contentList'
	| 'contentType'
	| 'contentLength'
	| 'idList'
	| 'banner'
	| 'thumbnail'
	| 'hasLicense'
	| 'activeLicense';

export type UploadPayloadDataType = { field: UploadPayloadType; data: any };

export type UploadStepType = 'details' | 'license' | 'checks';

export type UploadReduxType = {
	data: {
		content: any;
		contentList: FileMetadataType[];
		contentType: string;
		contentLength: number | null;
		license: any;
		title: string;
		description: string;
		collectionCode: string;
		contentTokens: number;
		useFractionalTokens: boolean;
		thumbnail: any;
		topics: string[];
		type: string;
		hasLicense: boolean;
		activeLicense: string;
	};
	currentStep: UploadStepType;
	nextStepDisabled: boolean;
	uploadActive: boolean;
	uploadDisabled: boolean;
	uploadCost: number;
	uploadType: UploadType;
};

export type SelectOptionType = { id: string; label: string };

export type URLViewType = {
	label: string;
	disabled: boolean;
	url: any;
	view: React.ComponentType;
};

export type FollowingType = { addresses: string[]; count: number };

export type CursorType = {
	next: string | null;
	previous: string | null;
};

export type TableRowType = {
	data: { [key: string]: any };
	active: boolean;
	viewed: boolean;
};

export type AlignType = 'left' | 'center' | 'right';

export type TableHeaderType = {
	[key: string]: { width: string; align: AlignType; display: string | null };
};

export type ActiveFieldAddType = 'title' | 'description';

export type GroupIndexType = { index: string; ids: string[] }[];

export type NotificationResponseType = {
	status: boolean;
	message: string | null;
};

export type AOProfileType = {
	id: string;
	walletAddress: string;
	displayName: string | null;
	username: string | null;
	bio: string | null;
	avatar: string | null;
	banner: string | null;
};

export type ProfileHeaderType = AOProfileType;

export type RegistryProfileType = {
	id: string;
	avatar: string | null;
	username: string;
	bio?: string;
};

export type NotificationType = {
	message: string;
	status: 'success' | 'warning';
};

export type RendererType = {
	label: string;
	domain: string;
};
