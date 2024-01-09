import styled from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column;
	}
`;

export const AWrapper = styled.div`
	width: calc(100% - 410px);
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0 0 20px 0;
	}
`;

export const ADWrapper = styled.div`
	width: 100%;
	border-radius: ${STYLING.dimensions.radius.alt1};
	animation: ${open} ${fadeIn1};
`;

export const ATWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const ACWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const RWrapper = styled.div`
	width: 385px;
	max-width: 100%;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
	}
`;
