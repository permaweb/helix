import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div``;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 15px;
	margin: 0 0 20px 0 !important;
	span {
		font-size: ${(props) => props.theme.typography.size.lg} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		font-family: ${(props) => props.theme.typography.family.alt1} !important;
		color: ${(props) => props.theme.colors.font.primary} !important;
		display: block;
	}
`;

export const OptionsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

export const Option = styled.button<{ active: boolean; disabled: boolean }>`
	background: ${(props) =>
		props.active ? props.theme.colors.button.primary.active.background : props.theme.colors.container.primary.active};
	border: 1px solid
		${(props) =>
			props.active ? props.theme.colors.button.primary.active.border : props.theme.colors.button.primary.border};
	border-radius: ${STYLING.dimensions.radius.primary};
	padding: 15px;
	&:hover {
		background: ${(props) => props.theme.colors.button.primary.active.background};
		border: 1px solid ${(props) => props.theme.colors.button.primary.active.border};
		p,
		span {
			color: ${(props) => props.theme.colors.font.light1} !important;
		}
	}
	span {
		font-size: ${(props) => props.theme.typography.size.base} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		font-family: ${(props) => props.theme.typography.family.alt1} !important;
		color: ${(props) => (props.active ? props.theme.colors.font.light1 : props.theme.colors.font.primary)} !important;
		display: block;
		text-align: left;
	}
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall} !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
		font-family: ${(props) => props.theme.typography.family.primary} !important;
		color: ${(props) => (props.active ? props.theme.colors.font.light1 : props.theme.colors.font.alt1)} !important;
		display: block;
		text-align: left;
		margin: 7.5px 0 0 0;
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.primary.disabled.background};
		border: 1px solid ${(props) => props.theme.colors.button.primary.disabled.border};
		p,
		span {
			color: ${(props) => props.theme.colors.button.primary.disabled.color} !important;
		}
		svg {
			fill: ${(props) => props.theme.colors.button.primary.disabled.color} !important;
			color: ${(props) => props.theme.colors.button.primary.disabled.color} !important;
		}
	}
`;

export const CWrapper = styled.div`
	display: flex;
	align-items: center;
	input {
		margin: 2.5px 0 0 0;
	}
	span {
		margin: 0 8.5px 0 0;
		font-size: ${(props) => props.theme.typography.size.xSmall} !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
		font-family: ${(props) => props.theme.typography.family.primary} !important;
	}
`;

export const AWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const ALicenseWrapper = styled.div`
	margin: 20px 0 0 0;
`;
