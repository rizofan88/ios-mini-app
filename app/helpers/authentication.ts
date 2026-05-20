import * as LocalAuthentication from 'expo-local-authentication';

//prompts you with face id if needed.
async function authenticateWithBiometrics() {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock with Face ID',
            fallbackLabel: 'Use Password', // shows fallback button on iOS
            });
            return result.success;
        }
    } 
    catch (e) {
        //console.log('Biometric auth error', e);
    }

    return null; // fallback to manual login
}