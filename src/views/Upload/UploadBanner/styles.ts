import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	margin: 40px 0 0 0;
	input {
		display: none;
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	p,
	span {
		line-height: 1.5;
	}
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		margin: 0 5px 5px 0;
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		display: block;
		max-width: 600px;
	}
	button {
		margin: 0 0 6.5px 0;
	}
`;

export const Tooltip = styled.div`
	padding: 0 20px 20px 20px;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: 1.5;
		color: ${(props) => props.theme.colors.font.primary};
	}
`;

export const Actions = styled.div`
	margin: 10px 0 0 0;
`;

export const Body = styled.div`
	margin: 7.5px 0 0 0;
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
`;

export const Select = styled.button`
	height: 150px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 1px dashed ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.radius.alt2};
	background: ${(props) => props.theme.colors.container.primary.background};
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
	svg {
		width: 30px;
		margin: 0 0 5px 0;
		fill: ${(props) => props.theme.colors.font.alt1};
	}
	&:hover {
		border: 1px dashed ${(props) => props.theme.colors.border.alt2};
		background: ${(props) => props.theme.colors.container.primary.active};
		span {
			color: ${(props) => props.theme.colors.font.primary};
		}
		svg {
			fill: ${(props) => props.theme.colors.font.primary};
		}
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.primary.disabled.background};
		border: 1px dashed ${(props) => props.theme.colors.button.primary.disabled.border};
		span {
			color: ${(props) => props.theme.colors.button.primary.disabled.color};
		}
		svg {
			fill: ${(props) => props.theme.colors.button.primary.disabled.color};
		}
	}
`;

export const TAction = styled.div`
	position: absolute;
	top: 7.5px;
	right: 7.5px;
	display: flex;
	justify-content: center;
	align-items: center;
	display: none;

	button {
		background: ${(props) => props.theme.colors.container.primary.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		svg {
			margin: 0px 0px 2.15px 0;
		}
	}
`;

export const TWrapper = styled.button<{ active: boolean }>`
	height: 150px;
	width: 100%;
	border-radius: ${STYLING.dimensions.radius.alt2};
	overflow: hidden;
	outline: 2.25px solid ${(props) => (props.active ? props.theme.colors.border.alt1 : 'transparent')};
	border: 2.25px solid transparent;
	opacity: ${(props) => (props.active ? '1' : '0.5')};
	position: relative;
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		background: ${(props) => props.theme.colors.container.alt3.background};
		border-radius: ${STYLING.dimensions.radius.alt2};
	}
	&:hover {
		opacity: 0.85;
		${TAction} {
			display: block;
		}
	}
	&:disabled {
		opacity: 0.5;
	}
`;

export const MWrapper = styled.div`
	padding: 0 20px 20px 20px;
	video {
		max-height: 330px !important;
		width: 100% !important;
		object-fit: cover;
		background: ${(props) => props.theme.colors.container.alt3.background};
		border-radius: ${STYLING.dimensions.radius.primary};
	}
`;

export const MInfo = styled.div`
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		line-height: 1.5;
		display: block;
		margin: 20px 0 0 0;
	}
`;

export const MActions = styled.div`
	margin: 20px 0 0 0;
	display: flex;
	justify-content: flex-end;
	flex-wrap: wrap;
	gap: 15px;
`;
