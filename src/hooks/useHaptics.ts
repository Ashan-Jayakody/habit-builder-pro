import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Check if we're on a native platform
const isNative = () => {
  return typeof (window as any).Capacitor !== 'undefined' && 
         (window as any).Capacitor.isNativePlatform?.();
};

export const useHaptics = () => {
  const impact = async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isNative()) return;
    
    try {
      const styleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      };
      await Haptics.impact({ style: styleMap[style] });
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const notification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (!isNative()) return;
    
    try {
      const typeMap = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error,
      };
      await Haptics.notification({ type: typeMap[type] });
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const vibrate = async (duration: number = 300) => {
    if (!isNative()) return;
    
    try {
      await Haptics.vibrate({ duration });
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const selectionStart = async () => {
    if (!isNative()) return;
    
    try {
      await Haptics.selectionStart();
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const selectionChanged = async () => {
    if (!isNative()) return;
    
    try {
      await Haptics.selectionChanged();
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const selectionEnd = async () => {
    if (!isNative()) return;
    
    try {
      await Haptics.selectionEnd();
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  return {
    impact,
    notification,
    vibrate,
    selectionStart,
    selectionChanged,
    selectionEnd,
  };
};
