import { supabase } from '../lib/supabase';
import {
    Donor,
    DonorRow,
    mapDonorFromDB,
    mapDonorToDB,
    mapDonorUpdateToDB,
} from '../lib/database.types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Query keys for React Query
export const donorKeys = {
    all: ['donors'] as const,
    list: () => [...donorKeys.all, 'list'] as const,
    byCode: (code: string) => [...donorKeys.all, 'byCode', code] as const,
};

// Fetch all donors
export async function getDonors(): Promise<Donor[]> {
    const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch donors: ${error.message}`);
    }

    return (data as DonorRow[] || []).map(mapDonorFromDB);
}

// Fetch donor by access code
export async function getDonorByCode(accessCode: string): Promise<Donor | null> {
    const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch donor: ${error.message}`);
    }

    return data ? mapDonorFromDB(data as DonorRow) : null;
}

// Create a new donor
export async function createDonor(donor: Omit<Donor, 'id' | 'createdAt'>): Promise<Donor> {
    const dbDonor = mapDonorToDB(donor);

    const { data, error } = await supabase
        .from('donors')
        .insert(dbDonor)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create donor: ${error.message}`);
    }

    return mapDonorFromDB(data as DonorRow);
}

// Update an existing donor
export async function updateDonor(
    accessCode: string,
    updates: Partial<Omit<Donor, 'id' | 'createdAt' | 'accessCode'>>
): Promise<Donor> {
    const dbUpdates = mapDonorUpdateToDB(updates);

    const { data, error } = await supabase
        .from('donors')
        .update(dbUpdates)
        .eq('access_code', accessCode)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update donor: ${error.message}`);
    }

    return mapDonorFromDB(data as DonorRow);
}

// Delete a donor
export async function deleteDonor(accessCode: string): Promise<void> {
    const { error } = await supabase
        .from('donors')
        .delete()
        .eq('access_code', accessCode);

    if (error) {
        throw new Error(`Failed to delete donor: ${error.message}`);
    }
}

// Real-time subscription
export function subscribeToDonors(
    onInsert: (donor: Donor) => void,
    onUpdate: (donor: Donor) => void,
    onDelete: (id: string) => void
): RealtimeChannel {
    return supabase
        .channel('donors-changes')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'donors' },
            (payload) => onInsert(mapDonorFromDB(payload.new as DonorRow))
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'donors' },
            (payload) => onUpdate(mapDonorFromDB(payload.new as DonorRow))
        )
        .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'donors' },
            (payload) => onDelete((payload.old as { id: string }).id)
        )
        .subscribe();
}
