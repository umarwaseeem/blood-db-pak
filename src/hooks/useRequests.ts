import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BloodRequest, RequestStatus } from '../lib/database.types';
import {
    requestKeys,
    getRequests,
    getRequestByCode,
    getRequestsByCode,
    createRequest,
    updateRequestStatus,
    deleteRequest,
    subscribeToRequests,
} from '../services/requestService';

// Hook to fetch all requests with real-time updates
export function useRequests() {
    const queryClient = useQueryClient();

    // Set up real-time subscription
    useEffect(() => {
        const channel = subscribeToRequests(
            // On insert: Add to cache
            (newRequest) => {
                queryClient.setQueryData<BloodRequest[]>(requestKeys.list(), (old) => {
                    if (!old) return [newRequest];
                    // Check if already exists (from optimistic update)
                    if (old.some((r) => r.id === newRequest.id)) {
                        return old.map((r) => (r.id === newRequest.id ? newRequest : r));
                    }
                    return [newRequest, ...old];
                });
                // Also update user-specific queries
                queryClient.setQueryData<BloodRequest[]>(
                    requestKeys.listByCode(newRequest.accessCode),
                    (old) => {
                        if (!old) return [newRequest];
                        if (old.some((r) => r.id === newRequest.id)) {
                            return old.map((r) => (r.id === newRequest.id ? newRequest : r));
                        }
                        return [newRequest, ...old];
                    }
                );
            },
            // On update: Update in cache
            (updatedRequest) => {
                queryClient.setQueryData<BloodRequest[]>(requestKeys.list(), (old) =>
                    old?.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)) ?? []
                );
                queryClient.setQueryData<BloodRequest[]>(
                    requestKeys.listByCode(updatedRequest.accessCode),
                    (old) =>
                        old?.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)) ?? []
                );
            },
            // On delete: Remove from cache
            (deletedId) => {
                queryClient.setQueryData<BloodRequest[]>(requestKeys.list(), (old) =>
                    old?.filter((r) => r.id !== deletedId) ?? []
                );
                // Note: We can't easily remove from user-specific queries without knowing the accessCode
                // The invalidation on settle will handle this
            }
        );

        return () => {
            channel.unsubscribe();
        };
    }, [queryClient]);

    return useQuery({
        queryKey: requestKeys.list(),
        queryFn: getRequests,
    });
}

// Hook to fetch a single request by access code
export function useRequestByCode(accessCode: string | undefined) {
    return useQuery({
        queryKey: requestKeys.byCode(accessCode || ''),
        queryFn: () => getRequestByCode(accessCode!),
        enabled: !!accessCode,
    });
}

// Hook to fetch all requests by access code
export function useRequestsByCode(accessCode: string | undefined) {
    return useQuery({
        queryKey: requestKeys.listByCode(accessCode || ''),
        queryFn: () => getRequestsByCode(accessCode!),
        enabled: !!accessCode,
    });
}

// Hook to create a new request with optimistic update
export function useCreateRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRequest,
        onMutate: async (newRequestData) => {
            await queryClient.cancelQueries({ queryKey: requestKeys.list() });
            await queryClient.cancelQueries({
                queryKey: requestKeys.listByCode(newRequestData.accessCode),
            });

            const previousRequests = queryClient.getQueryData<BloodRequest[]>(
                requestKeys.list()
            );
            const previousUserRequests = queryClient.getQueryData<BloodRequest[]>(
                requestKeys.listByCode(newRequestData.accessCode)
            );

            // Optimistic request
            const optimisticRequest: BloodRequest = {
                id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
                ...newRequestData,
            };

            queryClient.setQueryData<BloodRequest[]>(requestKeys.list(), (old) =>
                old ? [optimisticRequest, ...old] : [optimisticRequest]
            );

            queryClient.setQueryData<BloodRequest[]>(
                requestKeys.listByCode(newRequestData.accessCode),
                (old) => (old ? [optimisticRequest, ...old] : [optimisticRequest])
            );

            return { previousRequests, previousUserRequests, accessCode: newRequestData.accessCode };
        },
        onError: (_err, _newRequest, context) => {
            if (context?.previousRequests) {
                queryClient.setQueryData(requestKeys.list(), context.previousRequests);
            }
            if (context?.previousUserRequests && context?.accessCode) {
                queryClient.setQueryData(
                    requestKeys.listByCode(context.accessCode),
                    context.previousUserRequests
                );
            }
        },
        onSettled: (_data, _error, newRequest) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.list() });
            queryClient.invalidateQueries({
                queryKey: requestKeys.listByCode(newRequest.accessCode),
            });
        },
    });
}

// Hook to update request status with optimistic update
export function useUpdateRequestStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
            updateRequestStatus(id, status),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: requestKeys.list() });

            const previousRequests = queryClient.getQueryData<BloodRequest[]>(
                requestKeys.list()
            );

            // Find the request to get its accessCode for proper cache update
            const targetRequest = previousRequests?.find((r) => r.id === id);

            // Optimistically update
            queryClient.setQueryData<BloodRequest[]>(requestKeys.list(), (old) =>
                old?.map((r) => (r.id === id ? { ...r, status } : r)) ?? []
            );

            if (targetRequest) {
                const previousUserRequests = queryClient.getQueryData<BloodRequest[]>(
                    requestKeys.listByCode(targetRequest.accessCode)
                );

                queryClient.setQueryData<BloodRequest[]>(
                    requestKeys.listByCode(targetRequest.accessCode),
                    (old) => old?.map((r) => (r.id === id ? { ...r, status } : r)) ?? []
                );

                return {
                    previousRequests,
                    previousUserRequests,
                    accessCode: targetRequest.accessCode,
                };
            }

            return { previousRequests };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousRequests) {
                queryClient.setQueryData(requestKeys.list(), context.previousRequests);
            }
            if (context?.previousUserRequests && context?.accessCode) {
                queryClient.setQueryData(
                    requestKeys.listByCode(context.accessCode),
                    context.previousUserRequests
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: requestKeys.all });
        },
    });
}

// Hook to delete a request with optimistic update
export function useDeleteRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRequest,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: requestKeys.list() });

            const previousRequests = queryClient.getQueryData<BloodRequest[]>(
                requestKeys.list()
            );

            // Find the request to get its accessCode
            const targetRequest = previousRequests?.find((r) => r.id === id);

            // Optimistically remove
            queryClient.setQueryData<BloodRequest[]>(requestKeys.list(), (old) =>
                old?.filter((r) => r.id !== id) ?? []
            );

            if (targetRequest) {
                const previousUserRequests = queryClient.getQueryData<BloodRequest[]>(
                    requestKeys.listByCode(targetRequest.accessCode)
                );

                queryClient.setQueryData<BloodRequest[]>(
                    requestKeys.listByCode(targetRequest.accessCode),
                    (old) => old?.filter((r) => r.id !== id) ?? []
                );

                return {
                    previousRequests,
                    previousUserRequests,
                    accessCode: targetRequest.accessCode,
                };
            }

            return { previousRequests };
        },
        onError: (_err, _id, context) => {
            if (context?.previousRequests) {
                queryClient.setQueryData(requestKeys.list(), context.previousRequests);
            }
            if (context?.previousUserRequests && context?.accessCode) {
                queryClient.setQueryData(
                    requestKeys.listByCode(context.accessCode),
                    context.previousUserRequests
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: requestKeys.all });
        },
    });
}
