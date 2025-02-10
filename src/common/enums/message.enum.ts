export enum PublicMessage {
    NotFoundAccount="اکانت مورد نظر پیدا نشد",
    LoggedIn="با موفقعیت وارد حساب کاربری خود شدید",
    Updated="اطلاعات با موفقعیت ویرایش شد",
    NotFound="اطلاعات مورد نظر یافت نشد",
    SendOTP="کد تایید با موفقعیت ارسال شد",
    DeletedAccount="اکانت کاربر با موفقعیت حذف شد"
}

export enum AuthMessage {
    UnAuthorizedInValid="روش احراز هویت نامعتبر است",
    ExpiredCode="کد تایید منقضی شده لطفا مجددا تلاش نمایید",
    TryAgain="لطفا مجددا تلاش کنید",
    LoginAgain="لطفا مجددا وارد حساب کاربری خود شوید",
    InValidCodeOtp="کد تایید اشتباه می باشد",
    SendOtp="کد تایید با موفقعیت ارسال شد",
    LoginRequired="لطفا وارد حساب کاربری خود شوید",
    UserBlock="حساب کاربری کاربر مورد نظر با موفقعیت مسدود شد",
    Blocked="حساب کاربری شما مسدود شد لطفا با پشتیبانی در تماس باشید",
    UnBlock="حساب کاربری شما رفع مسدود شد"
}

export enum BadRequestMessage {
    InValidEmail="ایمیل وارد شده صحیح نمی باشد",
    InValidPhoen="شماره موبایل وارد شده صحیح نمی باشد",
    InValid="اطلاعات وارد شده صحیح نمی باشد",
    SomeThingWrong="خطایی رخ داده است لطفا مجددا تلاش کنید"
}

export enum ConflictMessage {
    AlreadyExistAccount="حساب کاربری با این مشخصات قبلا وجود دارد",
    AlreadyEmail="این ایمیل قبلا توسط شخصی دیگر استفاده شده",
    AlreadyPhone="این شماره تلفن قبلا توسط شخصی دیگر استفاده شده"
}

export enum ForbiddenMessage {
    NotExpiredOtpCode="کد تایید شما هنوز منقضی نشده",
    AccessDenied="دسترسی شما رد شد"
}

export enum ValidationMessage {
    InValidImageFormat="فرمت تصویر نامعتبر می باشد فقط فرومت های png, jpg قابل قبول است",
    InValidEmailFormat="فرمت ایمیل وارد شده صحیح نمی باشد",
    InValidPhoneFormat="شماره همراه وارد شده صحیح نمی باشد"
}