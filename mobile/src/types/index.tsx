// User and Auth types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'buyer' | 'company_seller' | 'student_seller';
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    companyName?: string;
    gstNumber?: string;
    createdAt?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

// Product types
export interface Category {
    id: string;
    name: string;
    icon_url?: string;
    description?: string;
}

export interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    original_price?: number;
    discount_percentage?: number;
    image_url?: string;
    stock_quantity?: number;
    seller_id?: string;
    seller_name?: string;
    category_id?: string;
    category_name?: string;
    rating?: number;
    createdAt?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

// Order types
export interface OrderItem {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
}

export interface Order {
    id: string;
    buyer_id: string;
    seller_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    delivery_address: string;
    delivery_city: string;
    delivery_state: string;
    delivery_zipcode: string;
    items?: OrderItem[];
    createdAt?: string;
    updatedAt?: string;
}

// Review types
export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    user?: {
        id: string;
        name: string;
    };
    createdAt?: string;
}

// Wishlist types
export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    product: Product;
    createdAt?: string;
}

// Generic API Response
export interface ApiResponse<T> {
    message: string;
    data?: T;
    [key: string]: any;
}
