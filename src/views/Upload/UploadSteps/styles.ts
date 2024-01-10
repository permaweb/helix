import styled from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	animation: ${open} ${fadeIn1};
`;

export const PWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const SWrapper = styled.div`
	margin: 25px 0 0 0;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		min-height: 0;
	}
`;

export const AWrapper = styled.div`
	margin: 40px 0 0 0;
	display: flex;
	justify-content: flex-end;
	> * {
		&:not(:last-child) {
			margin: 0 15px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const MWrapper = styled.div`
	width: fit-content;
	margin: 20px 0 0 auto;
	span {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		text-align: right;
		display: block;
		margin: 0 0 5px 0;
	}
`;
