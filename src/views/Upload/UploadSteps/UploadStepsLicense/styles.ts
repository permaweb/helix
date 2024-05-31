import styled from 'styled-components';

export const Wrapper = styled.div`
	padding: 20px;
	> * {
		&:not(:last-child) {
			margin: 0 0 15px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 15px;
	margin: 0 0 20px 0 !important;
	span {
		font-size: ${(props) => props.theme.typography.size.small} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		color: ${(props) => props.theme.colors.font.primary} !important;
		display: block;
	}
`;

export const CWrapper = styled.div`
	display: flex;
	align-items: center;
	span {
		margin: 0 6.5px 0 0;
		font-size: ${(props) => props.theme.typography.size.xSmall} !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
	}
`;

export const FlexWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 10px;
`;

export const FlexFitWrapper = styled(FlexWrapper)``;

export const SWrapper = styled.div`
	width: calc(100% - 130px);
`;

export const SSWrapper = styled.div`
	flex-grow: 1;
`;

export const SLWrapper = styled.div`
	width: calc(100% - 130px);
	flex-grow: 1;
`;

export const IWrapper = styled.div<{ disabled: boolean }>`
	width: 120px;
	position: relative;

	input {
		height: 40px !important;
		appearance: textfield;
		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			opacity: ${(props) => (props.disabled ? '0.5' : '1')};
		}
		&::-moz-focus-inner {
			border: 0;
		}
	}
	span,
	svg {
		display: block;
		position: absolute;
		right: 37.5px;
		top: 31.5px;
		opacity: ${(props) => (props.disabled ? '0.5' : '1')};
	}
	span {
		top: 30px;
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary};
	}
	svg {
		height: 17.5px;
		width: 17.5px;
	}
`;

export const ASWrapper = styled(SSWrapper)`
	width: 0;
	min-width: 120px;
`;

export const AWrapper = styled(IWrapper)`
	width: fit-content;
	flex-grow: 1;
	input {
		margin: 7.5px 0 0 0 !important;
		font-size: ${(props) => props.theme.typography.size.small} !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
		color: ${(props) =>
			props.disabled ? props.theme.colors.button.primary.disabled.color : props.theme.colors.font.primary};
	}
`;
