import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
`;

export const ListHeader = styled.div`
	width: 100%;
	background: ${(props) => props.theme.colors.container.primary.background};
`;

export const List = styled.ol`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	max-width: ${STYLING.cutoffs.max};
	margin: 0 auto;
	> * {
		&:not(:last-child) {
			margin: 0 20px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const Content = styled.div`
	max-width: ${STYLING.cutoffs.max};
	margin: 30px auto 0 auto;
`;

export const Tab = styled.li<{ active: boolean }>`
	position: relative;
	&:before {
		content: '';
		position: absolute;
		bottom: -10px;
		height: 5px;
		width: 100%;
		background: linear-gradient(
			to right,
			${(props) => props.theme.colors.gradient.start},
			${(props) => props.theme.colors.gradient.middle},
			${(props) => props.theme.colors.gradient.end}
		);
		opacity: ${(props) => (props.active ? 1 : 0)};
		transition: opacity 0.3s;
	}
`;

export const View = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
`;
