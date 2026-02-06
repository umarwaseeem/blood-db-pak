import { useState, useEffect, useCallback } from 'react';
import { parseDeepLink, clearDeepLinkParams, ShareableType } from '../utils/shareLink';

export interface DeepLinkState {
    targetType: ShareableType | null;
    targetId: string | null;
    isDeepLink: boolean;
}

export interface UseDeepLinkReturn extends DeepLinkState {
    clearTarget: () => void;
}

/**
 * Custom hook that handles deep link URL parameters
 * Parses URL on mount and provides state for navigating/scrolling to targets
 */
export const useDeepLink = (): UseDeepLinkReturn => {
    const [state, setState] = useState<DeepLinkState>({
        targetType: null,
        targetId: null,
        isDeepLink: false,
    });

    // Parse deep link on mount
    useEffect(() => {
        const { type, id } = parseDeepLink();

        if (type && id) {
            setState({
                targetType: type,
                targetId: id,
                isDeepLink: true,
            });
        }
    }, []);

    // Clear target and URL params
    const clearTarget = useCallback(() => {
        clearDeepLinkParams();
        setState({
            targetType: null,
            targetId: null,
            isDeepLink: false,
        });
    }, []);

    return {
        ...state,
        clearTarget,
    };
};
