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