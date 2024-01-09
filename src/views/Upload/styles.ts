import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 40px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column;
	}
`;

export const UWrapper = styled.div`
	min-width: 400px;
	width: calc(100% - 625px);
	@media (max-width: ${STYLING.cutoffs.initial}) {
		min-width: 0;
		width: 100%;
	}
`;

export const SWrapper = styled.div`
	width: 625px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
	}
`;

export const MWrapper = styled.div`
	padding: 0 20px 20px 20px;
`;

export const MInfo = styled.div`
	margin: 0 0 20px 0;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		line-height: 1.5;
	}
`;

export const MActions = styled.div`
	margin: 10px 0 0 0;
	display: flex;
	justify-content: flex-end;
	flex-wrap: wrap;
	gap: 15px;
`;

export const AWrapper = styled.div``;

export const AContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	animation: ${open} ${fadeIn2};
`;

export const AGraphic = styled.div`
	canvas {
		height: 300px !important;
	}
`;

export const AProgress = styled.div<{ percentage: string }>`
	height: 37.5px;
	width: 335px;
	max-width: 90vw;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.container.alt3.background};
	border-radius: 20px;
	overflow: hidden;
	position: relative;
	span {
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		line-height: 1.25;
		position: relative;
		z-index: 1;
		display: block;
		text-align: center;
	}
	> div {
		height: 100%;
		position: absolute;
		left: 0;
		width: ${(props) => props.percentage}%;
		background: ${(props) => props.theme.colors.container.alt6.background};
		transition: width 0.15s ease;
	}
`;

export const APercentage = styled.span`
	width: 30px;
`;

export const AMessage = styled.div`
	margin: 15px 0 0 0;
	width: 335px;
	max-width: 90vw;
	display: flex;
	span {
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		line-height: 1.5;
		text-align: center;
		text-shadow: 0 0 10px ${(props) => props.theme.colors.font.primary};
	}
`;
