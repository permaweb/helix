import { AssetType } from 'helpers/types';

export interface IProps {
	assets: AssetType[] | null;
	updating: boolean;
}
