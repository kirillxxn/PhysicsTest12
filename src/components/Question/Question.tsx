import React from 'react'
import styles from './Question.module.css'

type QuestionProps = {
	question: {
		number: number
		text: string
		imageUrl?: string
		options: Array<{ label: string; value: number }>
		physicalQuantities: [string, string]
	}
	answer: [number, number]
	onAnswerChange: (answer: [number, number]) => void
}

const Question: React.FC<QuestionProps> = ({
	question,
	answer,
	onAnswerChange,
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
		name: string
	) => {
		return question.options.map(option => (
			<label key={`${name}-${option.value}`} className={styles.option}>
				<input
					type='radio'
					name={name}
					value={option.value}
					checked={selectedValue === option.value}
					onChange={() => onChange(option.value)}
				/>
				<span>{option.label}</span>
			</label>
		))
	}

	const getImageUrl = (url: string | undefined): string => {
		if (!url) return ''

		const base = import.meta.env.BASE_URL

		if (url.startsWith(base)) {
			return url
		}

		return `${base}${url}`
	}

	return (
		<div className={styles.question}>
			<h3 className={styles.questionNumber}>Вопрос {question.number}</h3>
			<div className={styles.questionText}>{question.text}</div>

			{question.imageUrl && (
				<div className={styles.imageContainer}>
					<img
						src={getImageUrl(question.imageUrl)}
						alt='Иллюстрация к вопросу'
						onError={e => {
							const target = e.target as HTMLImageElement
							target.style.display = 'none'
							const parent = target.parentElement
							if (parent) {
								parent.style.display = 'none'
							}
						}}
						loading='lazy'
					/>
				</div>
			)}

			<div className={styles.answerSection}>
				<div className={styles.answerColumn}>
					<h4 className={styles.quantityTitle}>
						{question.physicalQuantities[0]}
					</h4>
					<div className={styles.options}>
						{renderOptions(answer[0], handleFirstChange, 'first')}
					</div>
				</div>

				<div className={styles.answerColumn}>
					<h4 className={styles.quantityTitle}>
						{question.physicalQuantities[1]}
					</h4>
					<div className={styles.options}>
						{renderOptions(answer[1], handleSecondChange, 'second')}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Question
