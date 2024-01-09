import styled from 'styled-components';

import { RangeBar } from 'app/styles';
import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Video = styled.video<{ loaded: boolean }>`
	height: 100%;
	max-height: 75vh;
	object-fit: contain;
	width: 100%;
	background: ${(props) => props.theme.colors.container.alt3.background};
	border-radius: ${STYLING.dimensions.radius.alt1} !important;
	display: ${(props) => (props.loaded ? 'block' : 'none')};
	@media (max-width: ${STYLING.cutoffs.initial}) {
		min-height: 0;
	}
`;

export const VLoader = styled.div`
	height: 512.5px;
	width: 100%;
	border-radius: ${STYLING.dimensions.radius.alt1};
	overflow: hidden;
	margin: 0 0 20px 0;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		height: 312.5px;
	}
`;

export const Controls = styled.div`
	width: 100%;
	position: absolute;
	bottom: 0;
	z-index: 1;
	background: ${(props) => `linear-gradient(0deg, ${props.theme.colors.overlay.alt2} 10%,transparent)`};
	border-bottom-left-radius: ${STYLING.dimensions.radius.alt1};
	border-bottom-right-radius: ${STYLING.dimensions.radius.alt1};
	animation: ${open} ${fadeIn2};
	padding: 10px;
	display: none;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		padding: 2.5px 5px;
	}
`;

export const ProgressBar = styled(RangeBar)`
	width: 100%;
`;

export const PTooltip = styled.div`
	position: absolute;
	bottom: 100%;
	left: 0;
	transform: translateX(-50%);
	display: block;
`;

export const Actions = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
`;

export const TimeRange = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	span {
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		display: block;
		text-align: center;
		min-width: 45px;
	}
`;

export const TDivider = styled.div`
	span {
		min-width: 0;
	}
`;

export const VolumeRange = styled(RangeBar)`
	width: 70px;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		display: none;
	}
`;

export const EndActions = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
	margin: 0 0 0 auto;
`;

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	&:hover {
		${Controls} {
			display: block;
		}
	}
`;

export const PiPOverlay = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	background: ${(props) => props.theme.colors.container.alt3.background};
	border-radius: ${STYLING.dimensions.radius.alt1};
	span {
		color: ${(props) => props.theme.colors.font.alt2};
		font-size: ${(props) => props.theme.typography.size.small};
	}
`;
