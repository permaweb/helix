import { Dispatch, SetStateAction } from 'react';

import { CursorType } from 'helpers/types';

export interface IProps {
	nPages: number;
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	scrollRef: any;
	showPageNumbers: boolean;
	handleCursorFetch: (cursor: string | null) => void;
	cursors: CursorType;
	useIcons: boolean;
}
