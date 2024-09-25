import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	width: 100%;
`;

export const Header = styled.div`
	margin: 0 0 10px 0;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		line-height: 1.5;
	}
`;

export const Body = styled.div`
	padding: 10px 15px;
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: 1.5;
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const BodyHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 15px;
`;

export const LLine = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 15px;
	position: relative;
	p,
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: 1.5;
	}
	p {
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const LFlex = styled.div`
	display: flex;
	align-items: center;
`;

export const LFlexValue = styled.div`
	min-width: 20px;
	margin: 0 0 0 7.5px;
	text-align: right;
	svg {
		height: 17.5px;
		width: 17.5px;
	}
`;

export const Action = styled.div`
	width: fit-content;
	margin: 20px 0 0 auto;
`;
