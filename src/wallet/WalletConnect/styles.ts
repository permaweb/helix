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
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		display: block;
		margin: 0 15px 0 0;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		span {
			display: none;
		}
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
	width: 350px;
	max-width: 90vw;
	padding: 20px 0 10px 0;
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
	margin: 20px 0 0 0;
	padding: 15px;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
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
	padding: 10px 0;
	li {
		text-align: center;
		height: 37.5px;
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: ${(props) => props.theme.typography.size.small};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary};
		border: 1px solid transparent;
		padding: 0 15px;
		transition: all 75ms;
		&:hover {
			background: ${(props) => props.theme.colors.button.primary.background};
		}
	}
`;

export const DFooterWrapper = styled(DBodyWrapper)`
	padding: 10px 0 0 0;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom: none;
`;
