export enum PublicMessage {
    NotFoundAccount="اکانت مورد نظر پیدا نشد",
    LoggedIn="با موفقعیت وارد حساب کاربری خود شدید",
    Updated="اطلاعات با موفقعیت ویرایش شد",
    NotFound="اطلاعات مورد نظر یافت نشد",
    SendOTP="کد تایید با موفقعیت ارسال شد",
    DeletedAccount="اکانت کاربر با موفقعیت حذف شد",
    Created="اطلاعات با موفقعیت ساخته شد"
}

export enum CategoryMessage {
    Created="دسته بندی جدید با موفقعیت ساخته شد",
    Removed="دسته بندی با موفقعیت حذف شد",
    Updated="دسته بندی با موفقعیت اپدیت شد",
    NotFound="دسته بندی مورد نظر پیدا نشد",
    InValidCategory="لطفا دسته بندی مورد نظر را صحیح وارد کنید"
}

export enum BlogMessage {
    Created="بلاگ جدید با موفقعیت ساخته شد",
    Updated="بلاگ مورد نظر با موفقعیت اپدیت شد",
    Deleted="بلاگ مورد نظر با موفقعیت حذف شد",
    NotFound="همچین بلاگی وجود ندارد",
    AlreadyBlog="این بلاگ قبلا ساخته شده",
    InValidStatus="لطفا وضعیت مقاله را درست وارد کنید",
    changeStatus="وضعیت بلاگ با موفقعیت تغییر کرد",
    Like="بلاگ با موفقعیت لایک شد",
    DisLike="لایک بلاگ برداشته شد",
    Bookmark="بلاگ با موفقعیت ذخیره شد",
    UnBookmark="بلاگ از لیست ذخیره پاک شد"
}

export enum CommentMessage {
    Created="کامنت شما با موفقعیت ثبت شد در صورت تایید نمایش داده خواهد شد",
    NotFound="کامنت مورد نظر پیدا نشد",
    AlreadyRejecte="کامنت قبلا توسط ادمین رد شده",
    AlreadyAccept="کامنت قبلا توسط ادمین تایید شده",
    Apccepted="نظر شما با موفقعیت تایید شد",
    Rejected="نظر شما با موفقعیت رد شد",
    Remove="نظر شما با موفقعیت حذف شد"
}

export enum CourseMessage {
    Created="دوره جدید با موفقعیت ساخته شد",
    AlreadyCourse="همچین دوره ای قبل ثبت شده"
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
    AlreadyPhone="این شماره تلفن قبلا توسط شخصی دیگر استفاده شده",
    AlreadyCategory="این دسته بندی قبلا ساخته شده",
    AlreadySlug="این مسیر قبلا ساخته شده لطفا مسیر جدیدی را انتخاب کنید"
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