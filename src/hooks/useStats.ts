import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useStats() {
    return useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            const [donorsRes, requestsRes] = await Promise.all([
                supabase.from('donors').select('*', { count: 'exact', head: true }),
                supabase.from('blood_requests').select('*', { count: 'exact', head: true })
            ]);

            return {
                donors: donorsRes.count || 0,
                requests: requestsRes.count || 0,
            };
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });
}
