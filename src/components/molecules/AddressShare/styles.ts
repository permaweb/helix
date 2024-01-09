import styled from 'styled-components';

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
