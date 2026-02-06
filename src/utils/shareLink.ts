/**
 * Deep Link Utilities for Shareable Links
 * Handles generation, parsing, and clipboard operations for shareable URLs
 */

export type ShareableType = 'donor' | 'request';

export interface DeepLinkParams {
    type: ShareableType | null;
    id: string | null;
}

/**
 * Generates a shareable URL with query parameters for a donor or request
 */
export const generateShareableLink = (type: ShareableType, id: string): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    const url = new URL(baseUrl);
    url.searchParams.set('type', type);
    url.searchParams.set('id', id);
    return url.toString();
};

/**
 * Copies text to clipboard with fallback for older browsers
 * Returns true if successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch {
        return false;
    }
};

/**
 * Parses the current URL for deep link parameters
 */
export const parseDeepLink = (): DeepLinkParams => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') as ShareableType | null;
    const id = params.get('id');

    // Validate type
    if (type && type !== 'donor' && type !== 'request') {
        return { type: null, id: null };
    }

    return { type, id };
};

/**
 * Clears deep link parameters from the URL without page reload
 */
export const clearDeepLinkParams = (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('type');
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url.toString());
};

/**
 * Scrolls to an element by ID with smooth animation
 */
export const scrollToElement = (elementId: string): boolean => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
    }
    return false;
};
