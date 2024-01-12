import styled from 'styled-components';

export const Wrapper = styled.div``;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 0 0 5px 0;
	h4 {
		color: ${(props) => props.theme.colors.font.alt2} !important;
		font-size: ${(props) => props.theme.typography.size.lg} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		line-height: 1.5 !important;
	}
`;

export const Body = styled.div`
	p {
		max-width: 500px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

export const CWrapper = styled.div`
	margin: auto;
`;

export const TMessage = styled.div`
	margin: 5px 0 0 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const MWrapper = styled.div`
	span {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		display: block;
		margin: 0 0 5px 0;
	}
`;

export const TAWrapper = styled.div`
	margin: 20px 0 0 0;
`;
