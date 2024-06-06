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
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		line-height: 1.5;
	}
`;

export const Body = styled.div``;

export const DDataWrapper = styled.div`
	margin: auto;
	padding: 0 10px 0 0;
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
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	box-shadow: 0 5px 15px 0 ${(props) => props.theme.colors.shadow.primary};
	border-radius: 50%;
	margin: 0 0 25px 0;
	svg {
		height: 75px;
		width: 75px;
		fill: ${(props) => props.theme.colors.icon.primary.fill};
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
		max-width: 330px;
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

export const DWrapper = styled.div`
	height: fit-content;
	width: fit-content;
	position: relative;
	margin: 5px auto 0 auto;
	button {
		svg {
			margin: 0 0 1px 0;
		}
	}
`;

export const DDropdown = styled.ul<{ open: boolean }>`
	width: 225px;
	padding: 10px 0;
	display: ${(props) => (props.open ? 'block' : 'none')};
	position: absolute;
	top: 26.5px;
	right: 15%;
	z-index: 1;
`;

export const LI = styled.li<{ disabled: boolean }>`
	pointer-events: ${(props) => (props.disabled ? 'none' : 'default')};
	text-align: center;
	height: 32.5px;
	display: flex;
	align-items: center;
	cursor: pointer;
	font-size: ${(props) => props.theme.typography.size.xSmall};
	color: ${(props) => props.theme.colors.font.primary};
	font-weight: ${(props) => props.theme.typography.weight.bold};
	background: ${(props) => (props.disabled ? props.theme.colors.button.primary.disabled.background : 'transparent')};
	padding: 0 15px;
	&:hover {
		background: ${(props) =>
			props.disabled
				? props.theme.colors.button.primary.disabled.background
				: props.theme.colors.container.primary.active};
	}
`;

export const MWrapper = styled.div`
	padding: 0 20px 20px 20px;
`;

export const MActions = styled.div`
	width: fit-content;
	display: flex;
	margin: 20px 0 0 auto;
	> * {
		&:not(:last-child) {
			margin: 0 15px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const TMessage = styled.div`
	margin: 5px 0 0 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;
