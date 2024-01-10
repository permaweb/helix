import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	padding: 15px 20px 20px 20px;
	h4 {
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		line-height: 1.5;
		margin: 0 0 25px 0;
	}
`;

export const TWrapper = styled.div``;

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
	margin: 2.5px 0 20px 0;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const TBody = styled.div`
	margin: 10px 0 0 0;
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
		color: ${(props) => props.theme.colors.font.primary};
		line-height: 1.5;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	svg {
		width: 7.5px;
		fill: ${(props) => (props.active ? props.theme.colors.font.alt2 : props.theme.colors.font.primary)};
		margin: 0 0 2.25px 5px;
	}
	&:hover {
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt1.active.background : props.theme.colors.container.primary.active};
		border: 1px solid
			${(props) => (props.active ? props.theme.colors.button.alt1.active.border : props.theme.colors.border.alt2)};
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
