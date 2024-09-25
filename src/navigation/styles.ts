import styled from 'styled-components';

import { openLeft } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	height: ${STYLING.dimensions.nav.headerHeight};
	width: 100%;
	position: fixed;
	z-index: 2;
	top: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	background: ${(props) => props.theme.colors.container.alt2.background};
`;

export const MFlex = styled.div`
	height: ${STYLING.dimensions.nav.headerHeight};
	width: fit-content;
	display: flex;
	align-items: center;
`;

export const MWrapper = styled.div`
	display: none;
	justify-content: center;
	align-items: center;
	margin: 0 5px 0 0;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: flex;
	}
`;

export const LWrapper = styled.div`
	margin: 0 0 0 7.5px;
	a {
		display: flex;
		align-items: center;
		text-decoration: none !important;
		&:hover {
			opacity: 0.65;
		}
	}
	svg {
		height: fit-content;
		height: 25px;
		width: 25px;
		fill: ${(props) => props.theme.colors.icon.primary.fill};
		color: ${(props) => props.theme.colors.icon.primary.fill};
	}
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.xxBold};
		display: block;
		margin: -2.15px 0 0 12.5px;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: 0 0 0 15px;
	}
`;

export const SEWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export const SWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	@media (max-width: ${STYLING.cutoffs.initial}) {
		position: relative;
		top: auto;
		left: auto;
		transform: translate(0, 0);
		margin: 0 10px 0 0;
	}
`;

export const EWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export const AWrapper = styled.div`
	margin: 0 20px 0 0;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		button {
			padding: 2.5px 0 0 0;
		}
	}
`;

export const TWrapper = styled.div`
	margin: 0 15px 0 0;
`;

export const BWrapper = styled.div`
	height: calc(100vh - ${STYLING.dimensions.nav.headerHeight});
	width: ${STYLING.dimensions.nav.panelWidthClosed};
	position: fixed;
	top: ${STYLING.dimensions.nav.headerHeight};
	left: 0;
	padding: 20px 0;
	> * {
		&:not(:last-child) {
			margin: 0 0 6.5px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: none;
	}
`;

export const BFlexWrapper = styled.div`
	> * {
		&:not(:last-child) {
			margin: 0 0 12.5px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const BNavItem = styled.div<{ active: boolean }>`
	height: fit-content;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-top-right-radius: ${STYLING.dimensions.radius.primary};
	border-bottom-right-radius: ${STYLING.dimensions.radius.primary};
	border-left: 5px solid transparent;
	position: relative;
	transition: all 100ms;
	svg {
		height: 19.5px;
		width: 19.5px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto 6.5px auto;
		fill: ${(props) => props.theme.colors.icon.primary.fill};
	}
	a,
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		text-align: center;
	}
	a {
		height: 100%;
		width: 100%;
		padding: 11.5px 0 7.5px 0;
		text-decoration: none !important;
	}
	&:hover {
		cursor: pointer;
		border-left: 5px solid ${(props) => props.theme.colors.border.alt2};
	}
	&:before {
		content: '';
		position: absolute;
		left: -5px;
		top: 0;
		bottom: 0;
		width: 5px;
		background: linear-gradient(
			to bottom,
			${(props) => props.theme.colors.gradient.start},
			${(props) => props.theme.colors.gradient.middle},
			${(props) => props.theme.colors.gradient.end}
		);
		opacity: ${(props) => (props.active ? 1 : 0)};
		transition: opacity 0.3s;
	}
`;

export const BNavItemFlex = styled(BNavItem)`
	flex-direction: row;
	border-radius: ${STYLING.dimensions.radius.primary};
	padding: 0 15px 2.5px 15px;
	border-left: none;
	border: 1px solid ${(props) => (props.active ? props.theme.colors.border.alt2 : props.theme.colors.border.primary)};
	a {
		display: flex;
		align-items: center;
	}
	svg {
		margin: auto 12.5px auto 0;
	}
	a,
	span {
		font-size: ${(props) => props.theme.typography.size.small};
	}
	&:hover {
		border: 1px solid ${(props) => props.theme.colors.border.alt2};
	}
	&:before {
		display: none;
	}
`;

export const PWrapper = styled.div`
	height: calc(100vh - 15px);
	width: ${STYLING.dimensions.nav.panelWidthOpen};
	max-width: 90vw;
	position: fixed;
	top: 7.5px;
	left: 7.5px;
	transition: width 50ms ease-out;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.radius.primary};
	animation: ${openLeft} 200ms;
`;

export const PMenu = styled.div`
	padding: 0 15.75px;
`;
