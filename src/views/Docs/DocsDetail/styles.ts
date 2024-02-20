import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
`;

export const HeaderWrapper = styled.div`
	width: 100%;
	margin: 0 auto;
	position: relative;
`;

export const HeaderContent = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20px;
	@media (max-width: ${STYLING.cutoffs.tablet}) {
		flex-direction: column;
		align-items: start;
		h2 {
			margin: 0 0 10px 0;
		}
	}
`;

export const BodyWrapper = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	margin: 20px 0 0 0;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column;
	}
`;
