import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { ASSETS, CURSORS } from 'helpers/config';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';
import { IProps } from './types';

export default function Paginator(props: IProps) {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	let pageNumbers: number[] = [];
	for (let i = 0; i < props.nPages + 1; i++) {
		pageNumbers[i] = i;
	}
	pageNumbers = pageNumbers.slice(1);
	const pageLength = pageNumbers.length;

	function getSliceStart() {
		switch (true) {
			case props.currentPage === 1:
				return 0;
			case props.currentPage <= pageLength:
				return props.currentPage - 2;
			default:
				return 0;
		}
	}

	function getSliceEnd() {
		switch (true) {
			case props.currentPage === 1:
				return props.currentPage + 2;
			case props.currentPage <= pageLength:
				return props.currentPage + 1;
			default:
				return 0;
		}
	}

	const sliceStart = getSliceStart();
	const sliceEnd = getSliceEnd();

	function handleScroll() {
		if (props.scrollRef.current) {
			setTimeout(function () {
				props.scrollRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}, 1);
		}
	}

	const handleNextPage = () => {
		props.handleCursorFetch(props.cursors.next);
		handleScroll();
	};

	const handlePreviousPage = () => {
		props.handleCursorFetch(props.cursors.previous);
		handleScroll();
	};

	const handleCurrentPage = (number: number) => {
		props.setCurrentPage(number);
	};

	function getPreviousAction() {
		if (props.useIcons) {
			return (
				<IconButton
					src={ASSETS.arrowPrevious}
					type={'primary'}
					handlePress={handlePreviousPage}
					disabled={!props.cursors.previous}
					dimensions={{ wrapper: 25, icon: 11 }}
				/>
			);
		} else {
			return (
				<Button
					label={language.previous}
					type={'alt1'}
					handlePress={handlePreviousPage}
					disabled={!props.cursors.previous}
					noMinWidth
				/>
			);
		}
	}

	function getNextAction() {
		if (props.useIcons) {
			return (
				<IconButton
					src={ASSETS.arrowNext}
					type={'primary'}
					handlePress={handleNextPage}
					disabled={!props.cursors.next || props.cursors.next === CURSORS.end}
					dimensions={{ wrapper: 25, icon: 11 }}
				/>
			);
		} else {
			return (
				<Button
					label={language.next}
					type={'alt1'}
					handlePress={handleNextPage}
					disabled={!props.cursors.next || props.cursors.next === CURSORS.end}
					noMinWidth
				/>
			);
		}
	}

	return (
		<S.Wrapper>
			{getPreviousAction()}
			{props.showPageNumbers && (
				<S.NumberContainer>
					{pageNumbers.slice(sliceStart, sliceEnd).map((number: number, index: number) => {
						return (
							<S.NumberButtonContainer key={index}>
								<Button
									label={number}
									type={'primary'}
									handlePress={() => handleCurrentPage(number)}
									active={number === props.currentPage}
									noMinWidth
								/>
							</S.NumberButtonContainer>
						);
					})}
					{!(props.currentPage >= pageLength - 1) && (
						<>
							{!(props.currentPage === pageLength - 2) && (
								<S.Ellipses>
									<span>...</span>
								</S.Ellipses>
							)}
							{!(props.nPages === 3) && (
								<S.NumberButtonContainer>
									<Button
										label={pageLength}
										type={'primary'}
										handlePress={() => handleCurrentPage(pageLength)}
										active={pageLength === props.currentPage}
										noMinWidth
									/>
								</S.NumberButtonContainer>
							)}
						</>
					)}
				</S.NumberContainer>
			)}
			{getNextAction()}
		</S.Wrapper>
	);
}
