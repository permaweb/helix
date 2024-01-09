import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { createAsset } from 'api';
import { getCommentById, getCommentsByAddress } from 'gql';

import { Avatar } from 'components/atoms/Avatar';
import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Notification } from 'components/atoms/Notification';
import { ASSETS, COMMENT_SPEC, CONTENT_TYPES, CURSORS, PAGINATORS, URLS } from 'helpers/config';
import { CommentGQLResponseType, CommentType } from 'helpers/types';
import { getCreatorLabel, getRelativeDate } from 'helpers/utils';
import { useStamps } from 'hooks/stamps';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';
import { IProps } from './types';

const MAX_COMMENT_LENGTH = 300;

function Comment(props: {
	comment: CommentType;
	address: string | null;
	stampData: any;
	handleStampAction: (id: string) => void;
}) {
	const navigate = useNavigate();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const { stampLib, stampDisabled } = useStamps();

	const [showReplies, setShowReplies] = React.useState<boolean>(false);

	const profileRedirect = props.address ? URLS.profileChannel(props.comment.creator.walletAddress) : null;
	const hasStamped =
		props.stampData && props.stampData[props.comment.id] && props.stampData[props.comment.id].connectedWalletStamped;

	return (
		<S.CommentWrapper>
			<S.CFlex>
				<S.CommentHeader>
					<Avatar
						owner={props.comment.creator}
						dimensions={{ wrapper: 30, icon: 18.5 }}
						callback={() => navigate(profileRedirect)}
					/>
				</S.CommentHeader>
				<S.CommentData>
					<Link to={profileRedirect}>
						<S.CreatorLink>{getCreatorLabel(props.comment.creator)}</S.CreatorLink>
					</Link>
					&nbsp;
					<span className={'date'}>{`· ${getRelativeDate(props.comment.dateCreated)}`}</span>
					<p>{props.comment.data}</p>
				</S.CommentData>
			</S.CFlex>
			<S.AWrapper>
				<S.SWrapper>
					<S.Action>
						<IconButton
							type={'primary'}
							src={ASSETS.comments}
							handlePress={() => setShowReplies(true)}
							dimensions={{ icon: 13.5, wrapper: 25 }}
							disabled={showReplies}
							useBottomToolTip
						/>
						<S.SInfo>
							<span>{language.reply}</span>
						</S.SInfo>
					</S.Action>
					<S.Action>
						<IconButton
							type={'primary'}
							src={ASSETS.stamp}
							handlePress={() => (props.stampData ? props.handleStampAction(props.comment.id) : {})}
							dimensions={{ icon: 12.5, wrapper: 25 }}
							disabled={hasStamped || !stampLib || !props.stampData || stampDisabled}
							tooltip={hasStamped ? language.stamped : language.stamp}
							useBottomToolTip
						/>
						<S.SInfo>
							<span>
								{props.stampData && props.stampData[props.comment.id] ? props.stampData[props.comment.id].total : 0}
							</span>
						</S.SInfo>
					</S.Action>
				</S.SWrapper>
			</S.AWrapper>
			{showReplies && (
				<S.RepliesWrapper>
					<AddressComments address={props.comment.id} topLevel={false} />
				</S.RepliesWrapper>
			)}
		</S.CommentWrapper>
	);
}

export default function AddressComments(props: IProps) {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const { stampLib, getStampObject, handleStamp } = useStamps();

	const commentCreateRef = React.useRef<any>(null);
	const wrapperRef = React.useRef<HTMLDivElement | null>(null);

	const [comments, setComments] = React.useState<CommentGQLResponseType>(null);
	const [updating, setUpdating] = React.useState<boolean>(false);
	const [wrapperRefVisible, setWrapperRefVisible] = React.useState<boolean>(false);

	const [commentResponse, setCommentResponse] = React.useState<any | null>(null);
	const [comment, setComment] = React.useState<string>('');
	const [loading, setLoading] = React.useState<boolean>(false);

	const [stampData, setStampData] = React.useState<any>(null);
	const [stampResponse, setStampResponse] = React.useState<string | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.address) {
				const commentsFetch = await getCommentsByAddress({ id: props.address, cursor: null });
				setComments(commentsFetch);
			}
		})();
	}, [props.address]);

	React.useEffect(() => {
		(async function () {
			if (comments && comments.data && comments.data.length && stampLib) {
				setStampData(await getStampObject(comments.data.map((comment: CommentType) => comment.id)));
			}
		})();
	}, [comments, stampLib]);

	const handleScroll = () => {
		if (wrapperRef.current) {
			const wrapperElement = wrapperRef.current.getBoundingClientRect();
			const wrapperCutoff = (wrapperElement.top + wrapperElement.bottom) / 2;
			const isVisible = wrapperCutoff >= 0 && wrapperCutoff <= window.innerHeight;
			setWrapperRefVisible(isVisible);
		}
	};

	React.useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [wrapperRef]);

	React.useEffect(() => {
		(async function () {
			if (wrapperRefVisible && comments && comments.nextCursor && comments.nextCursor !== CURSORS.end) {
				setUpdating(true);
				const commentsFetch = await getCommentsByAddress({ id: props.address, cursor: comments.nextCursor });
				setComments({
					data: [...comments.data, ...commentsFetch.data],
					count: commentsFetch.count,
					nextCursor: commentsFetch.nextCursor,
					previousCursor: commentsFetch.previousCursor,
				});
				setUpdating(false);
			}
		})();
	}, [wrapperRefVisible, comments]);

	const handleChange = () => {
		setComment(commentCreateRef.current.innerHTML);
	};

	function getInvalidComment() {
		if (!comment) return false;
		return comment.length > MAX_COMMENT_LENGTH;
	}

	async function handleSubmit(e: any) {
		if (arProvider.walletAddress) {
			e.preventDefault();
			e.stopPropagation();
			setLoading(true);
			try {
				const assetId = await createAsset({
					content: comment,
					contentType: CONTENT_TYPES.textPlain,
					title: comment.length > 25 ? `${comment.substring(0, 25)}...` : comment,
					description: comment,
					type: COMMENT_SPEC.protcolId,
					topics: [COMMENT_SPEC.protcolId],
					owner: arProvider.walletAddress,
					ticker: COMMENT_SPEC.ticker,
					dataProtocol: COMMENT_SPEC.protcolId,
					dataSource: props.address,
					renderWith: [COMMENT_SPEC.renderWith],
				});

				setLoading(false);
				setCommentResponse({
					status: true,
					message: language.posted,
				});

				setTimeout(() => {
					setCommentResponse(null), setComment('');
				}, 1000);

				await handleUpdate(assetId);
				setComment('');
				commentCreateRef.current.innerHTML = '';
			} catch (e: any) {
				console.error(e);
				setLoading(false);
				setCommentResponse({
					status: true,
					message: language.errorOccurred,
				});
			}
		}
	}

	async function handleStampAction(id: string) {
		const resultMessage = await handleStamp(id);
		if (resultMessage) {
			let updatedStampData = { ...stampData };
			updatedStampData[id] = {
				total: stampData[id] ? stampData[id].total + 1 : 1,
				vouched: stampData[id].vouched,
				connectedWalletStamped: true,
			};
			setStampData(updatedStampData);
			setStampResponse(resultMessage);
		}
	}

	async function handleUpdate(id: string) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		try {
			const comment: CommentType | null = await getCommentById({ id: id, dataSource: props.address });
			if (comment)
				setComments({
					data: [comment, ...comments.data],
					count: comments.count + 1,
					nextCursor: comments.nextCursor,
					previousCursor: comments.previousCursor,
				});
		} catch (error: any) {
			console.error(error);
		}
	}

	function getComments() {
		if (!comments) {
			return (
				<S.LWrapper>
					<span>{`${language.loading}...`}</span>
				</S.LWrapper>
			);
		} else {
			if (comments.data && comments.data.length > 0) {
				return (
					<S.CommentsWrapper>
						{comments.data.map((comment: CommentType, index: number) => {
							return (
								<Comment
									key={index}
									comment={comment}
									address={props.address}
									stampData={stampData}
									handleStampAction={(id: string) => handleStampAction(id)}
								/>
							);
						})}
						{updating && (
							<S.UWrapper>
								<Loader sm relative />
							</S.UWrapper>
						)}
					</S.CommentsWrapper>
				);
			}
		}
	}

	return props.address ? (
		<>
			<S.Wrapper ref={wrapperRef}>
				{props.topLevel && comments && (
					<S.Header>
						<span>{`${language.comments} (${comments && comments.count ? comments.count : 0}${
							comments.count && comments.count > PAGINATORS.default ? '+' : ''
						})`}</span>
					</S.Header>
				)}
				<S.CommentCreate>
					<S.CommentHeader>
						<Avatar
							owner={arProvider.profile ? arProvider.profile : null}
							dimensions={{ wrapper: 30, icon: 18.5 }}
							callback={null}
						/>
					</S.CommentHeader>
					<S.CommentCreateWrapper>
						<S.CommentCreateContent
							ref={commentCreateRef}
							contentEditable={!loading && commentResponse === null && arProvider.walletAddress !== null}
							onInput={handleChange}
							className={!comment ? 'placeholder' : ''}
							onWheel={(e) => e.currentTarget.blur()}
							invalid={getInvalidComment()}
							data-placeholder={
								arProvider.walletAddress
									? props.topLevel
										? `${language.addComment}...`
										: language.postYourReply
									: language.connectToContinue
							}
						/>
						<S.CommentCreateSubmit>
							{getInvalidComment() && (
								<S.CommentCreateCount>
									<p>{`${MAX_COMMENT_LENGTH - comment.length}`}</p>
								</S.CommentCreateCount>
							)}
							<Button
								type={'alt1'}
								label={commentResponse ? commentResponse.message : props.topLevel ? language.comment : language.reply}
								handlePress={(e: any) => handleSubmit(e)}
								disabled={
									!comment || loading || commentResponse !== null || getInvalidComment() || !arProvider.walletAddress
								}
								loading={loading}
								formSubmit
								noMinWidth
							/>
						</S.CommentCreateSubmit>
					</S.CommentCreateWrapper>
				</S.CommentCreate>
				<S.CommentsBody>{getComments()}</S.CommentsBody>
			</S.Wrapper>
			{stampResponse && <Notification message={stampResponse} callback={() => setStampResponse(null)} />}
		</>
	) : null;
}
