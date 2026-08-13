export interface Report {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    }

    export interface CreateReportRequest {
    title: string;
    description: string;
    category: string;
    location: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    }

    export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    }
    