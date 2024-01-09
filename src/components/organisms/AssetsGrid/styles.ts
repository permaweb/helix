import styled from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
	grid-gap: 25px 22.5px;
	max-width: 100%;
	margin: auto;
`;

export const AWrapper = styled.div`
	max-width: 400px;
	position: relative;
	animation: ${open} ${fadeIn1};
`;

export const AContent = styled.div`
	height: 190px;
	width: 100%;
	border-radius: ${STYLING.dimensions.radius.primary};
	overflow: hidden;
	position: relative;
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		background: ${(props) => props.theme.colors.container.alt3.background};
		border-radius: ${STYLING.dimensions.radius.primary};
	}
`;

export const VLength = styled.div`
	position: absolute;
	bottom: 5px;
	right: 5px;
`;

export const AContentLink = styled(AContent)`
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	background: ${(props) => props.theme.colors.overlay.alt1};
	opacity: 0;
	transition: ease 100ms;
	&:hover {
		opacity: 1;
	}
	a {
		display: block;
		height: 100%;
		width: 100%;
	}
`;

export const AInfo = styled.div`
	display: flex;
	margin: 12.5px 0 0 0;
`;

export const AInfo1 = styled.div`
	margin: 0 0 0 10px;
	p {
		color: ${(props) => props.theme.colors.font.primary} !important;
		font-size: ${(props) => props.theme.typography.size.base} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		&:hover {
			color: ${(props) => props.theme.colors.font.alt1} !important;
		}
	}
	a,
	button,
	span {
		display: inline-block;
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	a {
		text-decoration: none !important;
		color: ${(props) => props.theme.colors.font.alt1};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		&:hover {
			color: ${(props) => props.theme.colors.font.primary};
		}
	}
`;

export const AInfoFlex = styled.div`
	display: flex;
	margin: 5px 0 0 0;
`;

export const ATLoader = styled.div`
	height: 17.5px;
	width: 250px;
	border-radius: ${STYLING.dimensions.radius.alt3};
	overflow: hidden;
`;

export const AILoader = styled(ATLoader)`
	height: 14.5px;
	width: 200px;
`;

export const EWrapper = styled.div`
	width: fit-content;
	margin: 0 auto;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		text-align: center;
	}
`;
