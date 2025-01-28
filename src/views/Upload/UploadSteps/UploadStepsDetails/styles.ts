import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	h4 {
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		line-height: 1.5;
		margin: 0 0 15px 0;
	}
`;

export const SectionWrapper = styled.div`
	padding: 15px 20px 20px 20px;
`;

export const CollectionWrapper = styled(SectionWrapper)`
	padding: 0;
	h4 {
		margin: 0 0 20px 0;
	}
`;

export const COWrapper = styled.div`
	margin: 25px 0;
`;

export const CWrapper = styled.div`
	display: flex;
	align-items: center;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		display: block;
		margin: 0 10px 0 0;
	}
`;

export const TRWrapper = styled(CWrapper)`
	margin: 20px 0 0 0;
`;

export const TWrapper = styled.div`
	margin: 60px 0 0 0;
`;

export const THeader = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 15px;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	button {
		span {
			font-size: ${(props) => props.theme.typography.size.xSmall};
		}
	}
`;

export const TInfo = styled.div`
	margin: 2.5px 0 10px 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const TBody = styled.div`
	margin: 5px 0 0 0;
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
`;

export const TAction = styled.button<{ active: boolean }>`
	max-width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) =>
		props.active ? props.theme.colors.button.alt1.background : props.theme.colors.container.primary.background};
	border: 1px solid
		${(props) => (props.active ? props.theme.colors.button.alt1.border : props.theme.colors.border.primary)};
	border-radius: ${STYLING.dimensions.radius.alt2};
	padding: 2.5px 6.5px 1.5px 6.5px;
	overflow-x: hidden;
	span {
		font-size: ${(props) => props.theme.typography.size.xxxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => (props.active ? props.theme.colors.font.light1 : props.theme.colors.font.primary)};
		line-height: 1.5;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	svg {
		width: 7.5px;
		fill: ${(props) => (props.active ? props.theme.colors.font.light1 : props.theme.colors.font.primary)};
		margin: 0 0 2.25px 5px;
	}
	&:hover {
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt1.active.background : props.theme.colors.container.primary.active};
		border: 1px solid
			${(props) => (props.active ? props.theme.colors.button.alt1.active.border : props.theme.colors.border.alt2)};
		span {
			color: ${(props) => (props.active ? props.theme.colors.font.light1 : props.theme.colors.font.primary)};
		}
	}
`;

export const MWrapper = styled.form`
	padding: 0 20px 20px 20px;
	position: relative;
`;

export const MActions = styled.div`
	margin: 10px 0 0 0;
	display: flex;
	justify-content: flex-end;
	flex-wrap: wrap;
	gap: 15px;
`;

export const MWarning = styled.div`
	position: absolute;
	bottom: 20px;
	left: 20px;
	span {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const IWrapper = styled.div`
	margin: 0 0 20px 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const RWrapper = styled.div`
	margin: 60px 0 0 0;
`;

export const RHeader = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 15px;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	button {
		span {
			font-size: ${(props) => props.theme.typography.size.xSmall};
		}
	}
`;

export const RInfo = styled.div`
	margin: 2.5px 0 10px 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const ROptionsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px;
	margin: 12.5px 0 0 0;
`;

export const ROption = styled.button<{ active: boolean; disabled: boolean }>`
	background: ${(props) =>
		props.active ? props.theme.colors.button.primary.active.background : props.theme.colors.button.primary.background};
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
