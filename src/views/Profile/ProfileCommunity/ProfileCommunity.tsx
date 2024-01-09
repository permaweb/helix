import { AddressComments } from 'components/organisms/AddressComments';

import { IProps } from './types';

export default function ProfileCommunity(props: IProps) {
	return <AddressComments address={props.address} topLevel={true} />;
}
