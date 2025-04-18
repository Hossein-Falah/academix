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
    AlreadyCourse="همچین دوره ای قبل ثبت شده",
    NotFound="دوره مورد نظر پیدا نشد",
    Removed="دوره با موفقعیت حذف شد",
    Updated="دوره با موفقعیت ویرایش شد"
}

export enum ChapterMessage {
    Created="سر فصل جدید با موفقعیت ساخته شد",
    NotFound="سر فصل مورد نظر پیدا نشد",
    AleradyChapter="سر فصل مورد نظر از قبل ساخته شده",
    Removed="سر فصل مورد نظر با موفقعیت حذف شد",
    Updated="سر فصل مورد نظر با موفقعیت آپدیت شد"
}

export enum SesstionMessage {
    uploaded="جلسه جدید با موفقعیت اپلود شد",
    NotFound="جلسه مورد نظر پیدا نشد",
    Deleted="جلسه مورد نظر با موفقعیت حذف شد",
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

export enum DiscountMessage {
    ApplyDiscount="کد تخفیف با موفقعیت اعمال شد",
    Created="کد تخفیف جدید با موفقعیت ساخته شد",
    InValidDiscountField="شما باید یکی از فیلد های مبلغ یا درصد را پر کنید",
    AlreadyDiscount="این کد تخفیف قبلا ثبت شده",
    NotFound="کد تخفیف مورد نظر پیدا نشد",
    Removed="کد تخفیف مورد نظر با موفقعیت حذف شد",
    NotActive="این کد تخفیف غیر فعال می باشد",
    UsegeLimit="متاسفانه تعداد استفاده از این کد تخفیف به پایان رسیده است",
    Expires_code="متاسفانه این کد تخفیف منقضی شده است",
    AlreadyUseDiscount="شما در حال حاضر از این کد تخفیف استفاده کرده اید",
    AlreadyAppliedToCourse="این تخفیف در حال حاضر برای دوره ثبت شده"
}

export enum PaymentMessage {
    AlreadyPayment="محصول قبلا خریداری شده",
    bought="محصول با موفقعیت خریداری شد"
}

export enum OrderMessage {
    NotFound="سفارش مورد نظر پیدا نشد"
}

export enum BasketMessage {
    AddToBasket="دوره با موفقعیت به سبد خرید شما اضافه شد",
    AlreadyCourse="این دوره قبلا به سبد خرید شما اضافه شده",
    NotFound="هیچ دوره ای در سبد خرید شما وجود ندارد",
    Removed="دوره مورد نظر با موفقعیت از سبد خرید شما حذف شد"
}

export enum BadRequestMessage {
    InValidEmail="ایمیل وارد شده صحیح نمی باشد",
    InValidPhoen="شماره موبایل وارد شده صحیح نمی باشد",
    InValid="اطلاعات وارد شده صحیح نمی باشد",
    SomeThingWrong="خطایی رخ داده است لطفا مجددا تلاش کنید",
    InValidVideoFormat="اپلود کنید mp4 mov avi mkv لطفا ویدیو را با یکی از فرمت ها",
}

export enum TicketMessage {
    created="تیکت جدید با موفقیعت ساخته شد",
    Notfound="تیکت مورد نظر پیدا نشد",
    ConflictTicket="همچین تیکتی قبلا ثبت شده لطفا تیکت جدید ثبت نمایید",
    Removed="تیکت مورد نظر با موفقعیت حذف شد",
    Answered="تیکت با موفقعیت پاسخ داده شد",
    ChangeStatus="وضعیت تیکت با موفقعیت تغییر کرد"
}

export enum ConflictMessage {
    AlreadyExistAccount="حساب کاربری با این مشخصات قبلا وجود دارد",
    AlreadyEmail="این ایمیل قبلا توسط شخصی دیگر استفاده شده",
    AlreadyPhone="این شماره تلفن قبلا توسط شخصی دیگر استفاده شده",
    AlreadyCategory="این دسته بندی قبلا ساخته شده",
    AlreadySlug="این مسیر قبلا ساخته شده لطفا مسیر جدیدی را انتخاب کنید",
    AlreadyComment="این کامنت قبلا ثبت شده",
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