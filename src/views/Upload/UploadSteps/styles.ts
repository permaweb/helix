import styled from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	scroll-margin-top: 100px;
	animation: ${open} ${fadeIn1};
`;

export const PWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const SWrapper = styled.div`
	margin: 33.5px 0 0 0;
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
		background: ${(props) => props.theme.colors.warning};
		color: ${(props) => props.theme.colors.font.light1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		border-radius: ${STYLING.dimensions.radius.alt2};
		text-align: center;
		display: block;
		padding: 2.5px 12.5px;
		margin: 0 0 7.5px 0;
	}
`;
