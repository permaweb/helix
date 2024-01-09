import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div``;

export const TWrapper = styled.div`
	h1 {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: clamp(22px, 2.25vw, 26px);
		line-height: 1.5;
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		margin: 0 0 2.5px 0;
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
	}
`;

export const AWrapper = styled.div`
	height: fit-content;
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	margin: 20px 0;
`;

export const DHeaderWrapper = styled.div`
	width: fit-content;
	display: flex;
	align-items: center;
`;

export const DHeader = styled.div`
	margin: 0 20px 0 10px;
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		margin: 0 0 1.5px 0;
		&:hover {
			color: ${(props) => props.theme.colors.font.alt1} !important;
		}
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	a {
		text-decoration: none !important;
		color: ${(props) => props.theme.colors.font.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		&:hover {
			color: ${(props) => props.theme.colors.font.alt1};
		}
	}
`;

export const DActions = styled.div`
	height: fit-content;
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	margin: 0 0 0 auto;
	@media (max-width: ${STYLING.cutoffs.tablet}) {
		margin: 0;
	}
`;

export const DWrapper = styled.div`
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: 1.5;
	}
`;

export const TOWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin: 20px 0 0 0;
`;

export const Topic = styled.div`
	max-width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.container.alt4.background};
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
`;

export const LWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const ShareWrapper = styled.div`
	height: fit-content;
	position: relative;
	button {
		svg {
			height: 17.5px;
			width: 17.5px;
		}
	}
`;

export const ShareDropdown = styled.ul`
	width: 225px;
	padding: 10px 0;
	position: absolute;
	top: 45px;
	button {
		height: 100%;
		width: 100%;
		text-align: left;
		padding: 0 15px !important;
	}
	li {
		height: 35px;
		display: flex;
		align-items: center;
		cursor: pointer;
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		border: 1px solid transparent;
		padding: 0 15px;
		&:hover {
			background: ${(props) => props.theme.colors.button.primary.background};
		}
	}
`;

export const Share = styled.li`
	height: 35px;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: ${(props) => props.theme.colors.font.primary};
	font-size: ${(props) => props.theme.typography.size.xxSmall};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	border: 1px solid transparent;
	padding: 0 !important;
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
	button {
		display: flex;
		align-items: center;
		svg {
			height: 10px;
			width: 10px;
			margin: 1.5px 0 0 5.5px;
		}
	}
`;
