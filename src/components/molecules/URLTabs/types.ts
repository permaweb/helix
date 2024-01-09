import { URLViewType } from 'helpers/types';

export interface ITProps {
	label: string;
	disabled: boolean;
	active: boolean;
	handlePress: (url: string) => void;
	url: string;
}

export interface ICProps {
	tabs: URLViewType[];
}

export interface IUProps {
	tabs: URLViewType[];
	activeUrl: string;
}
