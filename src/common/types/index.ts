import { MulterFile } from "../utils/multer.util";

export type CookiePayload = {
    userId:string;
}

export type AuthResponse = {
    code:string;
    token:string;
}

export type AccessTokenPayload = {
    userId: string;
};

export type EmailTokenPayload = {
    email: string;
};

export type PhoneTokenPayload = {
    phone: string;
};

export type GoogleStrategyType = {
    firstName?: string,
    lastName?: string,
    email: string,
    image_profile?: string,
    accessToken?: string
}

export type ProfileImage = {
    image_profile:MulterFile[];
    bg_image:MulterFile[];
}

export type courseItem = {
    id: string;
    courseId: string;
    title:string;
    price:number;
    finalPrice:number
    discountAmount:number;
    isFree:boolean;
    isPublished:boolean;
}

export type BasketType = {
    courses: courseItem[];
    totalPrice:number;
    totalDiscountAmount:number;
    finalAmount:number;
}