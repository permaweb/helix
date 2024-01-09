import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';

export const Wrapper = styled.div`
	width: 100%;
	max-width: 95vw;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	animation: ${open} ${fadeIn2};
	p {
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		text-align: center;
	}
	button {
		margin: 25px 0 0 0;
	}
`;

export const Icon = styled.div`
	margin: 0 0 10px 0;
	svg {
		height: 125px;
		width: 125px;
		fill: ${(props) => props.theme.colors.icon.primary.fill};
	}
`;

export const WCWrapper = styled.div`
	height: auto;
`;
