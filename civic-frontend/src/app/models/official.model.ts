export interface Official {
    id: number;
    fullName: string;
    email: string;
    title: string;
    department: string;
    location: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    petitionsHandled: number;
    reportsResolved: number;
    joinedAt: string;
    }

    export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    }
    