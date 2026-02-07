import { Skeleton } from './ui/Skeleton';

export function RequestListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-md border-l-8 border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                            <Skeleton className="w-5 h-5 rounded-full mr-2" />
                            <Skeleton className="h-5 w-48" />
                        </div>
                        <div className="flex items-center">
                            <Skeleton className="w-5 h-5 rounded-full mr-2" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                    </div>

                    <Skeleton className="h-16 w-full rounded-lg mb-6" />

                    <div className="flex gap-2">
                        <Skeleton className="h-14 flex-1 rounded-xl" />
                        <Skeleton className="h-14 flex-1 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}
