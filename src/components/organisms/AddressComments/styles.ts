import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div``;

export const Header = styled.div`
	margin: 0 0 15px 0;
	span {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.xBold};
		line-height: 1.5;
	}
`;

export const CommentCreate = styled.div`
	display: flex;
`;

export const CommentHeader = styled.div`
	margin: 0 10px 0 0;
	display: flex;
	justify-content: space-between;
`;

export const CommentCreateWrapper = styled.div`
	width: 100%;
`;

export const CommentCreateContent = styled.div<{ invalid: boolean; contentEditable: any }>`
	resize: none;
	height: auto;
	width: 100%;
	color: ${(props) => (props.invalid ? props.theme.colors.warning : props.theme.colors.font.primary)};
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: 1.5;
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	padding: 0;
	border: none;
	outline: none;
	white-space: pre-wrap;
	overflow-wrap: break-word;
	&[contentEditable='true'] {
		cursor: text;
	}
	&[contentEditable='false'] {
		cursor: default;
	}
	padding: 0 0 5px 0;
	&.placeholder::before {
		content: attr(data-placeholder);
		color: ${(props) => props.theme.colors.font.alt1};
		cursor: text;
	}
`;

export const CommentCreateSubmit = styled.div`
	width: fit-content;
	display: flex;
	align-items: center;
	margin: 10px 0 0 auto;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 20px 0 0 auto;
	}
`;

export const CommentCreateCount = styled.div`
	margin: 0 20px 0 0;
	p {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: 1.5;
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const CommentsBody = styled.div`
	margin: 5px 0 0 0;
`;

export const CommentsWrapper = styled.div`
	position: relative;
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const CommentWrapper = styled.div`
	position: relative;
	&:after {
		content: '';
		height: calc(100% - 20px);
		width: 1.75px;
		border-right: 1.75px solid ${(props) => props.theme.colors.border.primary};
		position: absolute;
		top: 35px;
		left: 11.5px;
	}
`;

export const CFlex = styled.div`
	display: flex;
`;

export const CommentData = styled.div`
	p,
	span {
		color: ${(props) => props.theme.colors.font.primary};
		line-height: 1.5;
	}
	span {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		display: inline-block;
		margin: 0 0 2.5px 0;
	}
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	.date {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const CreatorLink = styled.span`
	font-size: ${(props) => props.theme.typography.size.xSmall};
	&:hover {
		color: ${(props) => props.theme.colors.font.alt1};
	}
`;

export const AWrapper = styled.div`
	width: fit-content;
	margin: 5px 0 0 32.5px;
`;

export const SWrapper = styled.div`
	display: flex;
	align-items: center;
	> * {
		&:not(:last-child) {
			margin: 0 20px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const Action = styled.div`
	display: flex;
	align-items: center;
`;

export const SInfo = styled.div`
	margin: 0 0 0 1.5px;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const LWrapper = styled.div`
	span {
		font-size: ${(props) => props.theme.typography.size.xxSmall};
	}
`;

export const UWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const RepliesWrapper = styled.div`
	margin: 10px 0 0 32.5px;
`;
