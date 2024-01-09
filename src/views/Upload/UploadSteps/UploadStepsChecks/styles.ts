import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div`
	> * {
		&:not(:last-child) {
			margin: 0 0 25px 0;
		}
		&:first-child {
			margin: 0 0 15px 0 !important;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const InfoWrapper = styled.div`
	padding: 10px 15px;
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const InfoHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 15px;
	margin: 0 0 10px 0 !important;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		line-height: 1.5;
	}
`;

export const InfoLine = styled.div`
	p,
	span {
		text-align: left;
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const InfoLineFlex = styled.div`
	display: flex;
	align-items: center;
	> * {
		&:not(:last-child) {
			margin: 0 7.5px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	button {
		span {
			font-size: ${(props) => props.theme.typography.size.xxSmall} !important;
		}
	}
`;

export const TWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

export const MWrapper = styled.div`
	padding: 0 20px 20px 20px;
	video {
		height: 350px !important;
		max-height: 50vh !important;
		width: 100% !important;
		object-fit: contain;
		background: ${(props) => props.theme.colors.container.alt3.background};
		border-radius: ${STYLING.dimensions.radius.primary};
	}
`;
