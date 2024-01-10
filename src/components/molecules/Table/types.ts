import React from 'react';

import { CursorType, TableHeaderType, TableRowType } from 'helpers/types';

export interface IProps {
	title: string;
	action?: React.ReactNode | null;
	header: TableHeaderType;
	data: TableRowType[];
	recordsPerPage: number;
	showPageNumbers: boolean;
	handleCursorFetch: (cursor: string | null) => void;
	cursors: CursorType;
	showNoResults: boolean;
}
