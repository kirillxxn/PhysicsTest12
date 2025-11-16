import React from 'react'
import styles from './Question.module.css'

type QuestionProps = {
	question: {
		id: string
		number: number
		text: string
		imageUrl?: string
		options: Array<{ label: string; value: number }>
		physicalQuantities: [string, string]
		correctAnswer: [number, number]
	}
	answer: [number, number]
	onAnswerChange: (answer: [number, number]) => void
	showCorrectAnswer?: boolean
}

const Question: React.FC<QuestionProps> = ({
	question,
	answer,
	onAnswerChange,
	showCorrectAnswer = false,
}) => {
	const handleFirstChange = (value: number) => {
		onAnswerChange([value, answer[1]])
	}

	const handleSecondChange = (value: number) => {
		onAnswerChange([answer[0], value])
	}

	const renderOptions = (
		selectedValue: number,
		onChange: (value: number) => void,
		name: string,
		correctValue?: number
	) => {
		return question.options.map(option => {
			const isSelected = selectedValue === option.value
			const isCorrect = showCorrectAnswer && correctValue === option.value
			const isWrong =
				showCorrectAnswer && isSelected && selectedValue !== correctValue

			return (
				<label
					key={`${name}-${option.value}`}
					className={`
            ${styles.option} 
            ${isSelected ? styles.selected : ''}
            ${isCorrect ? styles.correct : ''}
            ${isWrong ? styles.wrong : ''}
          `}
				>
					<input
						type='radio'
						name={name}
						value={option.value}
						checked={isSelected}
						onChange={() => onChange(option.value)}
						disabled={showCorrectAnswer}
					/>
					<span>{option.label}</span>
					{showCorrectAnswer && isCorrect && (
						<span className={styles.correctMarker}> ✓</span>
					)}
					{showCorrectAnswer && isWrong && (
						<span className={styles.wrongMarker}> ✗</span>
					)}
				</label>
			)
		})
	}

	return (
		<div className={styles.question}>
			<h3 className={styles.questionNumber}>Вопрос {question.number}</h3>
			<div className={styles.questionText}>{question.text}</div>

			{question.imageUrl && (
				<div className={styles.imageContainer}>
					<img
						src={question.imageUrl}
						alt='Иллюстрация к вопросу'
						onError={e => {
							const target = e.target as HTMLImageElement
							target.style.display = 'none'
							target.parentElement!.style.display = 'none'
						}}
					/>
				</div>
			)}

			{showCorrectAnswer && (
				<div className={styles.correctAnswerBanner}>
					Правильный ответ выделен зеленым цветом
				</div>
			)}

			<div className={styles.answerSection}>
				<div className={styles.answerColumn}>
					<h4 className={styles.quantityTitle}>
						{question.physicalQuantities[0]}
					</h4>
					<div className={styles.options}>
						{renderOptions(
							answer[0],
							handleFirstChange,
							'first',
							showCorrectAnswer ? question.correctAnswer[0] : undefined
						)}
					</div>
				</div>

				<div className={styles.answerColumn}>
					<h4 className={styles.quantityTitle}>
						{question.physicalQuantities[1]}
					</h4>
					<div className={styles.options}>
						{renderOptions(
							answer[1],
							handleSecondChange,
							'second',
							showCorrectAnswer ? question.correctAnswer[1] : undefined
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Question
