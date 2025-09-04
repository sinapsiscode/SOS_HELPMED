/**
 * Tests para hook de encuestas de satisfacción
 * ✅ Regla #7: Tests en lógica crítica
 */
import { renderHook, act } from '@testing-library/react-hooks'
import useSatisfactionSurvey from '../useSatisfactionSurvey'

describe('useSatisfactionSurvey', () => {
  const mockOnSubmit = jest.fn(() => ({ success: true }))
  const mockOnClose = jest.fn()
  const mockSurveyData = {
    serviceId: 'TEST123',
    serviceType: 'URGENCIA'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty ratings', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    expect(result.current.ratings).toEqual({
      question1: 0,
      question2: 0,
      question3: 0,
      question4: 0,
      question5: 0
    })
    expect(result.current.comments).toBe('')
  })

  it('should handle rating changes', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    act(() => {
      result.current.handleRatingChange('question1', 5)
    })

    expect(result.current.ratings.question1).toBe(5)
  })

  it('should calculate average rating correctly', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    act(() => {
      result.current.handleRatingChange('question1', 5)
      result.current.handleRatingChange('question2', 4)
      result.current.handleRatingChange('question3', 3)
    })

    // Average of 5, 4, 3 = 4.0
    expect(result.current.averageRating).toBe('4.0')
  })

  it('should validate that all questions are answered', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    expect(result.current.allQuestionsAnswered).toBe(false)

    act(() => {
      result.current.handleRatingChange('question1', 5)
      result.current.handleRatingChange('question2', 4)
      result.current.handleRatingChange('question3', 3)
      result.current.handleRatingChange('question4', 5)
      result.current.handleRatingChange('question5', 4)
    })

    expect(result.current.allQuestionsAnswered).toBe(true)
  })

  it('should handle comment changes', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    const testComment = 'Excelente servicio'
    act(() => {
      result.current.setComments(testComment)
    })

    expect(result.current.comments).toBe(testComment)
  })

  it('should reset survey correctly', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    act(() => {
      result.current.handleRatingChange('question1', 5)
      result.current.setComments('Test comment')
      result.current.resetSurvey()
    })

    expect(result.current.ratings.question1).toBe(0)
    expect(result.current.comments).toBe('')
  })

  it('should get correct rating label', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    expect(result.current.getRatingLabel(1)).toBe('Muy Insatisfecho')
    expect(result.current.getRatingLabel(3)).toBe('Neutral')
    expect(result.current.getRatingLabel(5)).toBe('Muy Satisfecho')
  })

  it('should get correct rating color', () => {
    const { result } = renderHook(() =>
      useSatisfactionSurvey(mockOnSubmit, mockOnClose, mockSurveyData)
    )

    expect(result.current.getRatingColor(5)).toBe('green')
    expect(result.current.getRatingColor(3)).toBe('yellow')
    expect(result.current.getRatingColor(1)).toBe('red')
  })
})
