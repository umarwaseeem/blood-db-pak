import { supabase } from '../lib/supabase';
import {
    BloodRequest,
    BloodRequestRow,
    RequestStatus,
    mapRequestFromDB,
    mapRequestToDB,
} from '../lib/database.types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Query keys for React Query
export const requestKeys = {
    all: ['requests'] as const,
    list: () => [...requestKeys.all, 'list'] as const,
    byCode: (code: string) => [...requestKeys.all, 'byCode', code] as const,
    listByCode: (code: string) => [...requestKeys.all, 'listByCode', code] as const,
};

// Fetch all requests
export async function getRequests(): Promise<BloodRequest[]> {
    const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch requests: ${error.message}`);
    }

    return (data as BloodRequestRow[] || []).map(mapRequestFromDB);
}

// Fetch request by access code (first one found)
export async function getRequestByCode(accessCode: string): Promise<BloodRequest | null> {
    const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch request: ${error.message}`);
    }

    return data ? mapRequestFromDB(data as BloodRequestRow) : null;
}

// Fetch all requests by access code
export async function getRequestsByCode(accessCode: string): Promise<BloodRequest[]> {
    const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch requests: ${error.message}`);
    }

    return (data as BloodRequestRow[] || []).map(mapRequestFromDB);
}

// Create a new request
export async function createRequest(
    request: Omit<BloodRequest, 'id' | 'createdAt'>
): Promise<BloodRequest> {
    const dbRequest = mapRequestToDB(request);

    const { data, error } = await supabase
        .from('blood_requests')
        .insert(dbRequest)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create request: ${error.message}`);
    }

    return mapRequestFromDB(data as BloodRequestRow);
}

// Update request status
export async function updateRequestStatus(
    id: string,
    status: RequestStatus
): Promise<BloodRequest> {
    const { data, error } = await supabase
        .from('blood_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update request status: ${error.message}`);
    }

    return mapRequestFromDB(data as BloodRequestRow);
}

// Delete a request by ID
export async function deleteRequest(id: string): Promise<void> {
    const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete request: ${error.message}`);
    }
}

// Delete all requests by access code
export async function deleteRequestsByCode(accessCode: string): Promise<void> {
    const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('access_code', accessCode);

    if (error) {
        throw new Error(`Failed to delete requests: ${error.message}`);
    }
}

// Real-time subscription
export function subscribeToRequests(
    onInsert: (request: BloodRequest) => void,
    onUpdate: (request: BloodRequest) => void,
    onDelete: (id: string) => void
): RealtimeChannel {
    return supabase
        .channel('requests-changes')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'blood_requests' },
            (payload) => onInsert(mapRequestFromDB(payload.new as BloodRequestRow))
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'blood_requests' },
            (payload) => onUpdate(mapRequestFromDB(payload.new as BloodRequestRow))
        )
        .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'blood_requests' },
            (payload) => onDelete((payload.old as { id: string }).id)
        )
        .subscribe();
}
