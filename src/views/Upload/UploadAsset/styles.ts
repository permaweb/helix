import styled from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';

export const Wrapper = styled.div`
	width: 100%;
	input {
		display: none;
	}
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	h4 {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: clamp(18px, 3.25vw, 24px);
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		line-height: 1.5;
	}
`;

export const Body = styled.div`
	margin: 40px 0 0 0;
`;

export const EWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	animation: ${open} ${fadeIn1};
`;

export const EIcon = styled.div`
	height: 125px;
	width: 125px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.container.alt4.background};
	border-radius: 50%;
	margin: 0 0 25px 0;
	svg {
		height: 75px;
		width: 75px;
		fill: ${(props) => props.theme.colors.icon.alt3.fill};
		margin: 2.5px 0 0 7.5px;
	}
`;

export const EInfo = styled.div`
	margin: 0 0 25px 0;
	p,
	span {
		text-align: center;
	}
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		display: block;
		margin: 5px 0 0 0;
	}
`;

export const FWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 25px;
	animation: ${open} ${fadeIn1};
`;

export const FContainer = styled.div`
	height: 250px;
	width: 100%;
	max-width: 425px;
	padding: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		text-align: center;
	}
`;

export const FInfoWrapper = styled.div`
	> * {
		&:not(:last-child) {
			margin: 0 0 6.5px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const FInfoLine = styled.div`
	p,
	span {
		text-align: left;
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const FInfoFlex = styled.div`
	display: flex;
	align-items: center;
	> * {
		&:not(:last-child) {
			margin: 0 7.5px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	button {
		span {
			font-size: ${(props) => props.theme.typography.size.xxSmall} !important;
		}
	}
`;

export const FName = styled(FInfoLine)`
	margin: 10px 0 0 0;
`;

export const CostWrapper = styled.div`
	padding: 15px 0 0 0;
	margin: 15px 0 0 0 !important;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	> * {
		&:not(:last-child) {
			margin: 0 0 6.5px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const BalanceWarning = styled.div`
	margin: 15px 0 0 0;
	span {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;
