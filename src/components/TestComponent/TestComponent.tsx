import React, { useState, useEffect } from 'react'
import Question from '../Question/Question'
import { questions } from '../../data/questions'
import type { TestResults, UserAnswer } from '../../types/test'
import styles from './TestComponent.module.css'

type AnswerState = {
	[key: number]: UserAnswer
}

const TestComponent: React.FC = () => {
	const [currentQuestion, setCurrentQuestion] = useState<number>(0)
	const [answers, setAnswers] = useState<AnswerState>({})
	const [showResults, setShowResults] = useState<boolean>(false)
	const [timeSpent, setTimeSpent] = useState<number>(0)
	const [showAnswers, setShowAnswers] = useState<boolean>(false)

	useEffect(() => {
		if (!showResults) {
			const timer = setInterval(() => {
				setTimeSpent(prev => prev + 1)
			}, 1000)
			return () => clearInterval(timer)
		}
	}, [showResults])

	const getOptionLabel = (value: number): string => {
		const options = [
			{ label: 'увеличивается', value: 1 },
			{ label: 'уменьшается', value: 2 },
			{ label: 'не изменяется', value: 3 },
		]
		return options.find(opt => opt.value === value)?.label || ''
	}

	const handleAnswer = (answer: [number, number]) => {
		const currentQuestionData = questions[currentQuestion]
		const isCorrect =
			answer[0] === currentQuestionData.correctAnswer[0] &&
			answer[1] === currentQuestionData.correctAnswer[1]

		setAnswers(prev => ({
			...prev,
			[currentQuestion]: {
				answer,
				isCorrect,
			},
		}))
	}

	const nextQuestion = () => {
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(prev => prev + 1)
		} else {
			setShowResults(true)
		}
	}

	const prevQuestion = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(prev => prev - 1)
		}
	}

	const goToQuestion = (index: number) => {
		setCurrentQuestion(index)
	}

	const calculateResults = (): TestResults => {
		let correct = 0
		Object.values(answers).forEach(answer => {
			if (answer.isCorrect) {
				correct++
			}
		})

		const total = questions.length
		const percentage = Math.round((correct / total) * 100)

		return { correct, total, percentage }
	}

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`
	}

	const toggleShowAnswers = () => {
		setShowAnswers(prev => !prev)
	}

	const getQuestionStatus = (
		index: number
	): 'correct' | 'incorrect' | 'unanswered' | 'current' => {
		if (index === currentQuestion) return 'current'
		if (!answers[index]) return 'unanswered'
		return answers[index].isCorrect ? 'correct' : 'incorrect'
	}

	if (showResults) {
		const { correct, total, percentage } = calculateResults()

		return (
			<div className={styles.results}>
				<h2>Результаты теста</h2>
				<div className={styles.resultStats}>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Правильных ответов:</span>
						<span className={styles.resultValue}>
							{correct} из {total}
						</span>
					</div>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Процент выполнения:</span>
						<span
							className={styles.resultValue}
							style={{
								color:
									percentage >= 80
										? '#27ae60'
										: percentage >= 60
										? '#f39c12'
										: '#e74c3c',
							}}
						>
							{percentage}%
						</span>
					</div>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Время выполнения:</span>
						<span className={styles.resultValue}>{formatTime(timeSpent)}</span>
					</div>
				</div>

				<div className={styles.resultsActions}>
					<button
						onClick={toggleShowAnswers}
						className={styles.showAnswersButton}
					>
						{showAnswers ? 'Скрыть ответы' : 'Показать ответы'}
					</button>

					<button
						onClick={() => window.location.reload()}
						className={styles.restartButton}
					>
						Начать заново
					</button>
				</div>

				{showAnswers && (
					<div className={styles.answersReview}>
						<h3>Проверка ответов</h3>
						<div className={styles.answersList}>
							{questions.map((question, index) => {
								const userAnswer = answers[index]
								const isCorrect = userAnswer?.isCorrect

								return (
									<div key={question.id} className={styles.answerItem}>
										<div className={styles.answerHeader}>
											<span className={styles.questionNumber}>
												Вопрос {index + 1}
											</span>
											<span
												className={`
                        ${styles.answerStatus} 
                        ${
													userAnswer
														? isCorrect
															? styles.correct
															: styles.incorrect
														: styles.unanswered
												}
                      `}
											>
												{userAnswer
													? isCorrect
														? '✓ Правильно'
														: '✗ Неправильно'
													: 'Не отвечено'}
											</span>
										</div>

										<div className={styles.questionText}>{question.text}</div>

										<div className={styles.answerComparison}>
											<div className={styles.answerColumn}>
												<strong>Ваш ответ:</strong>
												<div className={styles.answerValues}>
													{userAnswer ? (
														<>
															<div className={styles.physicalQuantity}>
																<span className={styles.quantityName}>
																	{question.physicalQuantities[0]}:
																</span>
																<span
																	className={`
                                  ${styles.answerValue} 
                                  ${
																		!isCorrect &&
																		userAnswer.answer[0] !==
																			question.correctAnswer[0]
																			? styles.wrongAnswer
																			: ''
																	}
                                `}
																>
																	{getOptionLabel(userAnswer.answer[0])}
																</span>
															</div>
															<div className={styles.physicalQuantity}>
																<span className={styles.quantityName}>
																	{question.physicalQuantities[1]}:
																</span>
																<span
																	className={`
                                  ${styles.answerValue} 
                                  ${
																		!isCorrect &&
																		userAnswer.answer[1] !==
																			question.correctAnswer[1]
																			? styles.wrongAnswer
																			: ''
																	}
                                `}
																>
																	{getOptionLabel(userAnswer.answer[1])}
																</span>
															</div>
														</>
													) : (
														<div className={styles.noAnswer}>— Не отвечено</div>
													)}
												</div>
											</div>

											{!isCorrect && userAnswer && (
												<div className={styles.answerColumn}>
													<strong className={styles.correctAnswerTitle}>
														Правильный ответ:
													</strong>
													<div className={styles.answerValues}>
														<div className={styles.physicalQuantity}>
															<span className={styles.quantityName}>
																{question.physicalQuantities[0]}:
															</span>
															<span
																className={`${styles.answerValue} ${styles.correctAnswer}`}
															>
																{getOptionLabel(question.correctAnswer[0])}
															</span>
														</div>
														<div className={styles.physicalQuantity}>
															<span className={styles.quantityName}>
																{question.physicalQuantities[1]}:
															</span>
															<span
																className={`${styles.answerValue} ${styles.correctAnswer}`}
															>
																{getOptionLabel(question.correctAnswer[1])}
															</span>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>
		)
	}

	const currentQuestionData = questions[currentQuestion]
	const currentAnswer: [number, number] = answers[currentQuestion]?.answer || [
		0, 0,
	]

	return (
		<div className={styles.testContainer}>
			<div className={styles.header}>
				<h1>Тест по физике</h1>
				<div className={styles.stats}>
					<div className={styles.progress}>
						Вопрос {currentQuestion + 1} из {questions.length}
					</div>
					<div className={styles.timer}>Время: {formatTime(timeSpent)}</div>
				</div>
			</div>

			<div className={styles.progressBar}>
				<div
					className={styles.progressFill}
					style={{
						width: `${((currentQuestion + 1) / questions.length) * 100}%`,
					}}
				></div>
			</div>

			<Question
				question={currentQuestionData}
				answer={currentAnswer}
				onAnswerChange={handleAnswer}
			/>

			<div className={styles.navigation}>
				<button
					onClick={prevQuestion}
					disabled={currentQuestion === 0}
					className={styles.navButton}
				>
					← Назад
				</button>

				<div className={styles.questionGrid}>
					{questions.map((_, index) => {
						const status = getQuestionStatus(index)
						return (
							<button
								key={index}
								onClick={() => goToQuestion(index)}
								className={`
                  ${styles.questionButton} 
                  ${styles[status]}
                `}
								title={`Вопрос ${index + 1}`}
							>
								{index + 1}
							</button>
						)
					})}
				</div>

				<button onClick={nextQuestion} className={styles.navButton}>
					{currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее →'}
				</button>
			</div>
		</div>
	)
}

export default TestComponent
