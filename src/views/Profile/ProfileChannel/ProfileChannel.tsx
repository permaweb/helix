import { AssetsTable } from 'components/organisms/AssetsTable';

import * as S from './styles';
import { IProps } from './types';

export default function ProfileChannel(props: IProps) {
	return (
		<S.Wrapper>
			<AssetsTable owners={[props.address]} />
		</S.Wrapper>
	);
}
