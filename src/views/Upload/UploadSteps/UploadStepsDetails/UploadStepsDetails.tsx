import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { checkDuplicateAsset } from 'gql';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { TextArea } from 'components/atoms/TextArea';
import { Modal } from 'components/molecules/Modal';
import { ASSETS, DEFAULT_ASSET_TOPICS, GATEWAYS } from 'helpers/config';
import { ValidationType } from 'helpers/types';
import { formatRequiredField } from 'helpers/utils';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

const MAX_DESCRIPTION_LENGTH = 500;

export default function UploadStepsDetails() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [topicOptions, setTopicOptions] = React.useState<string[]>(DEFAULT_ASSET_TOPICS);

	const [showTopicAdd, setShowTopicAdd] = React.useState<boolean>(false);
	const [additionalTopic, setAdditionalTopic] = React.useState<string>('');

	const [validatingTitle, setValidatingTitle] = React.useState<boolean>(false);
	const [invalidTitle, setInvalidTitle] = React.useState<ValidationType>({ status: false, message: null });

	React.useEffect(() => {
		if (validatingTitle) {
			dispatch(uploadActions.setStepDisabled(true));
			return;
		}

		const isDataValid =
			uploadReducer.data.title &&
			uploadReducer.data.description &&
			!invalidTitle.status;

		dispatch(uploadActions.setStepDisabled(!isDataValid));
	}, [
		validatingTitle,
		uploadReducer.data.title,
		uploadReducer.data.description,
		invalidTitle.status,
	]);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (uploadReducer.data.title) {
				handleTitleCheck();
			} else {
				setInvalidTitle({ status: false, message: null });
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [uploadReducer.data.title]);

	async function handleTitleCheck() {
		if (uploadReducer.data.title) {
			setValidatingTitle(true);
			if (await checkDuplicateAsset({ title: uploadReducer.data.title, gateway: GATEWAYS.arweave })) {
				setInvalidTitle({ status: true, message: language.assetExists });
			} else {
				setInvalidTitle({ status: false, message: null });
			}
			setValidatingTitle(false);
		}
	}

	function handleInputChange(e: any, field: 'title' | 'description') {
		dispatch(
			uploadActions.setUpload([
				{
					field: field,
					data: e.target.value,
				},
			])
		);
	}

	function handleTopicChange(topic: string) {
		let topics = [...uploadReducer.data.topics];
		if (topics.includes(topic)) {
			topics = topics.filter((t) => t !== topic);
		} else {
			topics.push(topic);
		}
		dispatch(
			uploadActions.setUpload([
				{
					field: 'topics',
					data: topics,
				},
			])
		);
	}

	function handleAdditionalTopicAdd(e: any) {
		e.preventDefault();
		e.stopPropagation();
		if (additionalTopic) {
			setTopicOptions([...topicOptions, additionalTopic]);
			handleTopicChange(additionalTopic);
			setAdditionalTopic('');
			setShowTopicAdd(false);
		}
	}

	function getInvalidDescription() {
		if (uploadReducer.data.description && uploadReducer.data.description.length > MAX_DESCRIPTION_LENGTH) {
			return {
				status: true,
				message: `${language.charLimitReached} (${uploadReducer.data.description.length} / ${MAX_DESCRIPTION_LENGTH})`,
			};
		}
		return { status: false, message: null };
	}

	return (
		<>
			<S.Wrapper className={'border-wrapper-primary'}>
				<FormField
					label={language.title}
					value={uploadReducer.data.title}
					onChange={(e: any) => handleInputChange(e, 'title')}
					disabled={false}
					invalid={invalidTitle}
					required
				/>
				<TextArea
					label={language.description}
					value={uploadReducer.data.description}
					onChange={(e: any) => handleInputChange(e, 'description')}
					disabled={false}
					invalid={getInvalidDescription()}
					required
				/>
				{/* <S.TWrapper>
					<S.THeader>
						<span>{formatRequiredField(language.topics)}</span>
						<Button type={'alt2'} label={language.addTopic} handlePress={() => setShowTopicAdd(true)} />
					</S.THeader>
					<S.TBody>
						{topicOptions.map((topic: string, index: number) => {
							return (
								<S.TAction
									key={index}
									active={uploadReducer.data.topics.includes(topic)}
									onClick={() => handleTopicChange(topic)}
								>
									<span>{topic.toUpperCase()}</span>
									<ReactSVG src={ASSETS.add} />
								</S.TAction>
							);
						})}
					</S.TBody>
				</S.TWrapper> */}
			</S.Wrapper>
			{/* {showTopicAdd && (
				<Modal header={language.addTopic} handleClose={() => setShowTopicAdd(false)}>
					<S.MWrapper onSubmit={(e: any) => handleAdditionalTopicAdd(e)}>
						<FormField
							label={language.topic}
							value={additionalTopic}
							onChange={(e: any) => setAdditionalTopic(e.target.value)}
							disabled={false}
							invalid={{ status: false, message: null }}
						/>
						<S.MActions>
							<Button type={'primary'} label={language.cancel} handlePress={() => setShowTopicAdd(false)} />
							<Button
								type={'alt1'}
								label={language.submit}
								handlePress={(e: any) => handleAdditionalTopicAdd(e)}
								disabled={topicOptions.includes(additionalTopic) || !additionalTopic}
								formSubmit
							/>
						</S.MActions>
						<S.MWarning>{topicOptions.includes(additionalTopic) && <span>Topic exists</span>}</S.MWarning>
					</S.MWrapper>
				</Modal>
			)} */}
		</>
	);
}
