import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	height: 100%;
	display: flex;
	animation: ${open} ${fadeIn2};
`;

export const PWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export const ProfileWrapper = styled.div`
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: none;
	}
`;

export const LAction = styled.button`
	margin: 0 0 0 20px;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		display: block;
		margin: 0 15px 0 0;
	}
	&:hover {
		span {
			color: ${(props) => props.theme.colors.font.alt1};
		}
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: none;
	}
`;

export const FlexAction = styled.div`
	display: flex;
	align-items: center;
	svg {
		height: 25px;
		width: 20px;
		margin: 0 -2.5px 0 11.5px;
	}
`;

export const Dropdown = styled.ul`
	width: 315px;
	max-width: 90vw;
	padding: 20px 0 0 0;
	position: absolute;
	top: 57.5px;
	right: 15.75px;
	border-radius: ${STYLING.dimensions.radius.primary};
`;

export const DHeaderWrapper = styled.div`
	width: 100%;
`;

export const DHeaderFlex = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0 15px;
`;

export const DHeader = styled.div`
	margin: 0 0 0 10px;
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const BWrapper = styled.div`
	width: calc(100% - 30px);
	margin: 10px auto 5px auto;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const BalanceLine = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	span {
		font-size: ${(props) => props.theme.typography.size.base};
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary};
	}
	svg {
		height: 16.5px;
		width: 16.5px;
		margin: 2.5px 8.5px 0 0;
		color: ${(props) => props.theme.colors.font.alt1};
		fill: ${(props) => props.theme.colors.font.alt1};
	}
`;

export const BHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const BHeaderActions = styled.div`
	display: flex;
	align-items: center;
	> * {
		&:not(:last-child) {
			margin: 0 10px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	span {
		font-size: ${(props) => props.theme.typography.size.xxSmall} !important;
	}
`;

export const DBodyWrapper = styled.ul`
	width: 100%;
	padding: 0 7.5px 10px 7.5px;
	li {
		text-align: center;
		height: 40.5px;
		display: flex;
		align-items: center;
		cursor: pointer;
		color: ${(props) => props.theme.colors.font.primary};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		border: 1px solid transparent;
		border-radius: ${STYLING.dimensions.radius.alt2};
		transition: all 100ms;
		padding: 0 7.5px;
		svg {
			height: 14.5px;
			width: 14.5px;
			margin: 2.5px 10.5px 0 0;
			color: ${(props) => props.theme.colors.font.alt1};
			fill: ${(props) => props.theme.colors.font.alt1};
		}
		&:hover {
			color: ${(props) => props.theme.colors.font.primary};
			background: ${(props) => props.theme.colors.container.primary.active};
		}

		a {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			border-radius: ${STYLING.dimensions.radius.primary};
			&:hover {
				color: ${(props) => props.theme.colors.font.primary};
				background: ${(props) => props.theme.colors.container.primary.active};
			}
		}
	}
`;

export const DFooterWrapper = styled(DBodyWrapper)`
	border-bottom: none;
	svg {
		height: 15.5px;
		width: 15.5px;
		margin: 6.5px 8.5px 0 0;
		color: ${(props) => props.theme.colors.font.alt1};
		fill: ${(props) => props.theme.colors.font.alt1};
	}
`;
