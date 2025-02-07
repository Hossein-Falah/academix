export enum PublicMessage {
    NotFoundAccount="اکانت مورد نظر پیدا نشد",
}

export enum AuthMessage {
    UnAuthorizedInValid="روش احراز هویت نامعتبر است"
}

export enum BadRequestMessage {
    InValidEmail="ایمیل وارد شده صحیح نمی باشد",
    InValidPhoen="شماره موبایل وارد شده صحیح نمی باشد",
    InValid="اطلاعات وارد شده صحیح نمی باشد"
}

export enum ConflictMessage {
    AlreadyExistAccount="حساب کاربری با این مشخصات قبلا وجود دارد"
}