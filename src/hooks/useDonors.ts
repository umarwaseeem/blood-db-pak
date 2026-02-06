import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Donor } from '../lib/database.types';
import {
    donorKeys,
    getDonors,
    getDonorByCode,
    createDonor,
    updateDonor,
    deleteDonor,
    subscribeToDonors,
} from '../services/donorService';

// Hook to fetch all donors with real-time updates
export function useDonors() {
    const queryClient = useQueryClient();

    // Set up real-time subscription
    useEffect(() => {
        const channel = subscribeToDonors(
            // On insert: Add to cache
            (newDonor) => {
                queryClient.setQueryData<Donor[]>(donorKeys.list(), (old) => {
                    if (!old) return [newDonor];
                    // Check if already exists (from optimistic update)
                    if (old.some((d) => d.accessCode === newDonor.accessCode)) {
                        return old.map((d) =>
                            d.accessCode === newDonor.accessCode ? newDonor : d
                        );
                    }
                    return [newDonor, ...old];
                });
            },
            // On update: Update in cache
            (updatedDonor) => {
                queryClient.setQueryData<Donor[]>(donorKeys.list(), (old) =>
                    old?.map((d) => (d.id === updatedDonor.id ? updatedDonor : d)) ?? []
                );
                // Also update individual query if it exists
                queryClient.setQueryData(
                    donorKeys.byCode(updatedDonor.accessCode),
                    updatedDonor
                );
            },
            // On delete: Remove from cache
            (deletedId) => {
                queryClient.setQueryData<Donor[]>(donorKeys.list(), (old) =>
                    old?.filter((d) => d.id !== deletedId) ?? []
                );
            }
        );

        return () => {
            channel.unsubscribe();
        };
    }, [queryClient]);

    return useQuery({
        queryKey: donorKeys.list(),
        queryFn: getDonors,
    });
}

// Hook to fetch a single donor by access code
export function useDonorByCode(accessCode: string | undefined) {
    return useQuery({
        queryKey: donorKeys.byCode(accessCode || ''),
        queryFn: () => getDonorByCode(accessCode!),
        enabled: !!accessCode,
    });
}

// Hook to create a new donor with optimistic update
export function useCreateDonor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDonor,
        onMutate: async (newDonorData) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: donorKeys.list() });

            // Snapshot the previous value
            const previousDonors = queryClient.getQueryData<Donor[]>(donorKeys.list());

            // Optimistically update the cache
            const optimisticDonor: Donor = {
                id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
                ...newDonorData,
            };

            queryClient.setQueryData<Donor[]>(donorKeys.list(), (old) =>
                old ? [optimisticDonor, ...old] : [optimisticDonor]
            );

            return { previousDonors };
        },
        onError: (_err, _newDonor, context) => {
            // Rollback on error
            if (context?.previousDonors) {
                queryClient.setQueryData(donorKeys.list(), context.previousDonors);
            }
        },
        onSettled: () => {
            // Refetch to ensure sync with server
            queryClient.invalidateQueries({ queryKey: donorKeys.list() });
        },
    });
}

// Hook to update a donor with optimistic update
export function useUpdateDonor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            accessCode,
            updates,
        }: {
            accessCode: string;
            updates: Partial<Omit<Donor, 'id' | 'createdAt' | 'accessCode'>>;
        }) => updateDonor(accessCode, updates),
        onMutate: async ({ accessCode, updates }) => {
            await queryClient.cancelQueries({ queryKey: donorKeys.list() });
            await queryClient.cancelQueries({ queryKey: donorKeys.byCode(accessCode) });

            const previousDonors = queryClient.getQueryData<Donor[]>(donorKeys.list());
            const previousDonor = queryClient.getQueryData<Donor>(
                donorKeys.byCode(accessCode)
            );

            // Optimistically update the list
            queryClient.setQueryData<Donor[]>(donorKeys.list(), (old) =>
                old?.map((d) =>
                    d.accessCode === accessCode ? { ...d, ...updates } : d
                ) ?? []
            );

            // Optimistically update the individual query
            if (previousDonor) {
                queryClient.setQueryData(donorKeys.byCode(accessCode), {
                    ...previousDonor,
                    ...updates,
                });
            }

            return { previousDonors, previousDonor, accessCode };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousDonors) {
                queryClient.setQueryData(donorKeys.list(), context.previousDonors);
            }
            if (context?.previousDonor && context?.accessCode) {
                queryClient.setQueryData(
                    donorKeys.byCode(context.accessCode),
                    context.previousDonor
                );
            }
        },
        onSettled: (_data, _error, { accessCode }) => {
            queryClient.invalidateQueries({ queryKey: donorKeys.list() });
            queryClient.invalidateQueries({ queryKey: donorKeys.byCode(accessCode) });
        },
    });
}

// Hook to delete a donor with optimistic update
export function useDeleteDonor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDonor,
        onMutate: async (accessCode) => {
            await queryClient.cancelQueries({ queryKey: donorKeys.list() });

            const previousDonors = queryClient.getQueryData<Donor[]>(donorKeys.list());

            // Optimistically remove from cache
            queryClient.setQueryData<Donor[]>(donorKeys.list(), (old) =>
                old?.filter((d) => d.accessCode !== accessCode) ?? []
            );

            // Remove individual query
            queryClient.removeQueries({ queryKey: donorKeys.byCode(accessCode) });

            return { previousDonors };
        },
        onError: (_err, _accessCode, context) => {
            if (context?.previousDonors) {
                queryClient.setQueryData(donorKeys.list(), context.previousDonors);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: donorKeys.list() });
        },
    });
}
