import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { checkDuplicateTitle } from 'gql';

import { Button } from 'components/atoms/Button';
import { Checkbox } from 'components/atoms/Checkbox';
import { FormField } from 'components/atoms/FormField';
import { TextArea } from 'components/atoms/TextArea';
import { Modal } from 'components/molecules/Modal';
import { ASSETS, DEFAULT_ASSET_TOPICS, GATEWAYS, RENDERERS } from 'helpers/config';
import { RendererType, ValidationType } from 'helpers/types';
import { formatRequiredField } from 'helpers/utils';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

const MAX_DESCRIPTION_LENGTH = 500;

// TODO: Collection option on asset upload
export default function UploadStepsDetails() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [topicOptions, setTopicOptions] = React.useState<string[]>([
		...new Set([...DEFAULT_ASSET_TOPICS, ...uploadReducer.data.topics]),
	]);

	const [rendererOptions, _setRendererOptions] = React.useState<Object>(RENDERERS);
	const [renderer, setRenderer] = React.useState<RendererType | null>(null);

	const [showTopicAdd, setShowTopicAdd] = React.useState<boolean>(false);
	const [additionalTopic, setAdditionalTopic] = React.useState<string>('');

	const [validatingTitle, setValidatingTitle] = React.useState<boolean>(false);
	const [invalidTitle, setInvalidTitle] = React.useState<ValidationType>({ status: false, message: null });

	React.useEffect(() => {
		if (validatingTitle) {
			dispatch(uploadActions.setStepDisabled(true));
			return;
		}

		let isDataValid: boolean = false;

		switch (uploadReducer.uploadType) {
			case 'collection':
				isDataValid =
					uploadReducer.data.title &&
					uploadReducer.data.description &&
					uploadReducer.data.topics.length &&
					!invalidTitle.status &&
					!getInvalidContentTokens().status &&
					!getInvalidDescription().status;
				break;
			case 'assets':
				isDataValid = uploadReducer.data.topics.length && !getInvalidContentTokens().status;
				break;
		}

		dispatch(uploadActions.setStepDisabled(!isDataValid));
	}, [
		validatingTitle,
		uploadReducer.data.title,
		uploadReducer.data.description,
		uploadReducer.data.contentTokens,
		uploadReducer.data.topics,
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
			if (await checkDuplicateTitle({ title: uploadReducer.data.title, gateway: GATEWAYS.arweave })) {
				setInvalidTitle({ status: true, message: language.collectionExists });
			} else {
				setInvalidTitle({ status: false, message: null });
			}
			setValidatingTitle(false);
		}
	}

	function handleInputChange(e: any, field: 'title' | 'description' | 'collectionCode' | 'contentTokens') {
		dispatch(
			uploadActions.setUpload([
				{
					field: field,
					data: e.target.value,
				},
			])
		);
	}

	function handleUseFractionalChange() {
		dispatch(
			uploadActions.setUpload([
				{
					field: 'useFractionalTokens',
					data: !uploadReducer.data.useFractionalTokens,
				},
			])
		);
	}

	function handleTransferableChange() {
		dispatch(
			uploadActions.setUpload([
				{
					field: 'transferableTokens',
					data: !uploadReducer.data.transferableTokens,
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

	function handleRendererChange(value: RendererType) {
		let rendererUpdate = null;

		if (renderer?.label === value.label) {
			rendererUpdate = null;
		} else {
			rendererUpdate = value;
		}

		setRenderer(rendererUpdate);
		dispatch(
			uploadActions.setUpload([
				{
					field: 'renderer',
					data: rendererUpdate ? rendererUpdate.domain : null,
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

	function getInvalidContentTokens() {
		const contentTokens = Number(uploadReducer.data.contentTokens);
		if (!Number.isInteger(contentTokens) || contentTokens <= 0 || contentTokens > 1000000) {
			return {
				status: true,
				message: language.invalidContentTokens,
			};
		}
		return { status: false, message: null };
	}

	return (
		<>
			<S.Wrapper>
				{uploadReducer.uploadType === 'collection' && (
					<>
						<S.CollectionWrapper>
							<h4>{language.collectionDetails}</h4>
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
						</S.CollectionWrapper>
						<S.IWrapper>
							<span>{language.assetInfoNote}</span>
						</S.IWrapper>
					</>
				)}
				<S.SectionWrapper className={'border-wrapper-primary'}>
					<h4>{language.assetDetails}</h4>
					<S.COWrapper>
						<S.CWrapper>
							<span>{language.contentTokensCheckInfo}</span>
							<Checkbox
								checked={uploadReducer.data.useFractionalTokens}
								handleSelect={handleUseFractionalChange}
								disabled={false}
							/>
						</S.CWrapper>
						{uploadReducer.data.useFractionalTokens && (
							<FormField
								type={'number'}
								label={language.contentTokens}
								value={uploadReducer.data.useFractionalTokens ? uploadReducer.data.contentTokens : 1}
								onChange={(e: any) => handleInputChange(e, 'contentTokens')}
								disabled={!uploadReducer.data.useFractionalTokens}
								invalid={getInvalidContentTokens()}
								tooltip={language.contentTokensInfo}
								required
								hideErrorMessage
							/>
						)}
					</S.COWrapper>
					<S.TWrapper>
						<S.THeader>
							<span>{formatRequiredField(language.topics)}</span>
							<Button type={'alt2'} label={language.addTopic} handlePress={() => setShowTopicAdd(true)} />
						</S.THeader>
						<S.TInfo>
							<span>{language.topicInfo}</span>
						</S.TInfo>
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
					</S.TWrapper>
					<S.RWrapper>
						<S.RHeader>
							<span>{language.renderer}</span>
						</S.RHeader>
						<S.RInfo>
							<span>{language.rendererInfo}</span>
						</S.RInfo>
						<S.ROptionsWrapper>
							{Object.keys(rendererOptions).map((id: string, index: number) => {
								return (
									<S.ROption
										key={index}
										active={renderer?.label === rendererOptions[id].label}
										disabled={false}
										onClick={() => handleRendererChange(rendererOptions[id])}
									>
										<span>{rendererOptions[id].label}</span>
										<p>{rendererOptions[id].description}</p>
									</S.ROption>
								);
							})}
						</S.ROptionsWrapper>
					</S.RWrapper>
					<S.TRWrapper>
						<span>{language.transferableTokensCheckInfo}</span>
						<Checkbox
							checked={uploadReducer.data.transferableTokens}
							handleSelect={handleTransferableChange}
							disabled={false}
						/>
					</S.TRWrapper>
				</S.SectionWrapper>
			</S.Wrapper>
			{showTopicAdd && (
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
							<Button type={'primary'} label={language.cancel} handlePress={() => setShowTopicAdd(false)} noMinWidth />
							<Button
								type={'alt1'}
								label={language.submit}
								handlePress={(e: any) => handleAdditionalTopicAdd(e)}
								disabled={topicOptions.includes(additionalTopic) || !additionalTopic}
								formSubmit
								noMinWidth
							/>
						</S.MActions>
						<S.MWarning>{topicOptions.includes(additionalTopic) && <span>Topic exists</span>}</S.MWarning>
					</S.MWrapper>
				</Modal>
			)}
		</>
	);
}
