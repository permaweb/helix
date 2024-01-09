import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const MWrapper = styled.div`
	padding: 0 20px 20px 20px;
	position: relative;
`;

export const MInfo = styled.div`
	margin: 10px 0 0 0;
	p,
	span {
		line-height: 1.5;
	}
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-size: ${(props) => props.theme.typography.size.small};
		margin: 0 0 5px 0;
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		font-size: ${(props) => props.theme.typography.size.xSmall};
	}
`;

export const DWrapper = styled.div`
	margin: 20px 0 0 0;
`;

export const DHeader = styled.div`
	margin: 0 0 7.5px 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-size: ${(props) => props.theme.typography.size.xSmall};
	}
`;

export const DElements = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
	button {
		border-radius: ${STYLING.dimensions.radius.primary};
	}
`;

export const CWrapper = styled(DWrapper)`
	margin: 30px 0 0 0;
	input {
		width: 150px !important;
	}
`;

export const COWrapper = styled.div`
	padding: 10px;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-size: ${(props) => props.theme.typography.size.xSmall};
	}
`;

export const COHeader = styled(DHeader)``;

export const MActions = styled.div`
	margin: 30px 0 0 0;
	display: flex;
	justify-content: flex-end;
	flex-wrap: wrap;
	gap: 15px;
`;

export const COWrapperAlt = styled(COWrapper)`
	margin: 20px 0 0 0;
`;

export const LWrapper = styled.div`
	margin: 0 auto 20px auto;
`;
