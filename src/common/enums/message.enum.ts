export enum PublicMessage {
    NotFoundAccount="اکانت مورد نظر پیدا نشد",
    LoggedIn="با موفقعیت وارد حساب کاربری خود شدید"
}

export enum AuthMessage {
    UnAuthorizedInValid="روش احراز هویت نامعتبر است",
    ExpiredCode="کد تایید منقضی شده لطفا مجددا تلاش نمایید",
    TryAgain="لطفا مجددا تلاش کنید",
    LoginAgain="لطفا مجددا وارد حساب کاربری خود شوید",
    InValidCodeOtp="کد تایید اشتباه می باشد",
    SendOtp="کد تایید با موفقعیت ارسال شد",
    LoginRequired="لطفا وارد حساب کاربری خود شوید",
    Blocked="حساب کاربری شما مسدود شد لطفا با پشتیبانی در تماس باشید"
}

export enum BadRequestMessage {
    InValidEmail="ایمیل وارد شده صحیح نمی باشد",
    InValidPhoen="شماره موبایل وارد شده صحیح نمی باشد",
    InValid="اطلاعات وارد شده صحیح نمی باشد"
}

export enum ConflictMessage {
    AlreadyExistAccount="حساب کاربری با این مشخصات قبلا وجود دارد"
}

export enum ForbiddenMessage {
    NotExpiredOtpCode="کد تایید شما هنوز منقضی نشده"
}