import { SOUND_CONFIG } from '../mocks/notificationData'

/**
 * Hook especializado para reproducción de sonidos de notificación
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Sound management
 * ✅ Manejo de errores incluido
 */
const useNotificationSounds = () => {
  const playEmergencySound = (emergencyType) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const soundConfig = emergencyType === 'sos' ? SOUND_CONFIG.SOS : SOUND_CONFIG.NORMAL

      oscillator.frequency.value = soundConfig.frequency
      oscillator.type = soundConfig.type
      gainNode.gain.setValueAtTime(soundConfig.gain, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + soundConfig.duration
      )

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + soundConfig.duration)
    } catch (e) {
      console.log('No se pudo reproducir sonido:', e)
    }
  }

  return {
    playEmergencySound
  }
}

export default useNotificationSounds