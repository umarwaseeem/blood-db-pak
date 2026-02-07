import { Skeleton } from './ui/Skeleton';

export function DonorListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
                        <div className="flex-grow">
                            <div className="flex justify-between mb-4">
                                <div className="space-y-2 flex-grow">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <Skeleton className="h-10 w-16 rounded-full ml-4" />
                            </div>
                            <div className="space-y-2 mb-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-12 flex-1 rounded-xl" />
                                <Skeleton className="h-12 flex-1 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
