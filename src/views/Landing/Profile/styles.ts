import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div``;

export const HeaderInfo = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 25px;
	padding: 20px;
	border-radius: ${STYLING.dimensions.radius.primary};
	background: ${(props) => props.theme.colors.overlay.alt3};
	box-shadow: 0 5px 20px 5px ${(props) => props.theme.colors.shadow.primary};
`;

export const HeaderAvatar = styled.div`
	height: 145px;
	width: 145px;
	background: ${(props) => props.theme.colors.container.alt2.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		height: 80px;
		width: 80px;
		stroke: ${(props) => props.theme.colors.icon.primary.fill};
	}
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		border-radius: 50%;
	}
`;

export const HeaderHA = styled.div`
	h4 {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: clamp(24px, 3.25vw, 32px);
		font-weight: ${(props) => props.theme.typography.weight.xxBold};
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
`;

export const HeaderInfoDetail = styled.div`
	margin: 2.5px 0 0 0;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const HeaderInfoAction = styled.div`
	display: flex;
	align-items: center;
	margin: 10px 0 0 0;
	button {
		span {
			color: ${(props) => props.theme.colors.font.primary} !important;
		}
		&:hover {
			span {
				color: ${(props) => props.theme.colors.font.primary} !important;
			}
			opacity: 0.75;
		}
		&:focus {
			span {
				color: ${(props) => props.theme.colors.font.primary} !important;
			}
			opacity: 0.75;
		}
	}
`;

export const HBio = styled.div`
	display: flex;
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		width: 100%;
		max-width: 300px;
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		p {
			white-space: normal;
		}
	}
`;

export const HAction = styled.div`
	margin: 0 0 0 5px;
	button {
		padding: 1.5px 0 0 0 !important;
	}
	svg {
		transform: rotate(180deg);
		margin: 2.5px 0 0 0.5px;
	}
`;

export const HeaderAddress = styled.button`
	display: flex;
	align-items: center;
	margin: 7.5px 0 0 0;
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		margin: 0 0 0 10px;
	}
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		display: block;
		margin: 0 0 3.5px 10px;
	}
	svg {
		width: 15px;
		fill: ${(props) => props.theme.colors.font.primary};
		margin: 5px 0 0 0;
	}
	&:hover {
		opacity: 0.75;
	}
`;

export const HeaderActions = styled.div`
	height: fit-content;
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	margin: 0 0 0 auto;
`;

export const Body = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 40px;
	margin: 40px 0 0 0;
`;

export const TWrapper = styled.div`
	flex-grow: 1;
	width: 550px;
	max-width: 100%;
	margin: 0 auto;
`;

export const MWrapper = styled.div`
	padding: 0 20px 20px 20px;
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const MSection = styled.div`
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		line-height: calc(${(props) => props.theme.typography.size.lg} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
	}
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const MDetailSection = styled.div`
	display: flex;
	align-items: center;
	a,
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		line-height: 1.5;
		overflow-wrap: anywhere;
		display: block;
		margin: -5px 0 0 0;
		max-width: 300px;
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	svg {
		width: 17.5px;
		margin: 0 10px 0 0;
		fill: ${(props) => props.theme.colors.font.primary};
	}
`;
