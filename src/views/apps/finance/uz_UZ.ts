import enGB from 'date-fns/locale/en-GB';

const Calendar = {
    sunday: 'Yak',
    monday: 'Du',
    tuesday: 'Se',
    wednesday: 'Chor',
    thursday: 'Pa',
    friday: 'Ju',
    saturday: 'Sha',
    ok: 'OK',
    today: 'Bugun',
    yesterday: 'Ertaga',
    hours: 'Soat',
    minutes: 'Minut',
    seconds: 'Sekund',
    formattedMonthPattern: 'mm yyyy',
    formattedDayPattern: 'kk mm yyyy',
    dateLocale: enGB,
};

const locale: any = {
    common: {
        loading: 'Loading...',
        emptyMessage: 'Ma\'lumot topilmadi'
    },
    Plaintext: {
        unfilled: 'Unfilled',
        notSelected: 'Not selected',
        notUploaded: 'Not uploaded'
    },
    Pagination: {
        more: 'More',
        prev: 'Previous',
        next: 'Next',
        first: 'First',
        last: 'Last',
        limit: '{0} / page',
        total: 'Total Rows: {0}',
        skip: 'Go to{0}'
    },
    Calendar,
    DatePicker: {
        ...Calendar,
        january: 'Yanvar',
        february: 'Fevral',
        march: 'Mart',
        april: 'Aprel',
        may: 'May',
        june: 'Iyun',
        july: 'Iyul',
        august: 'Avgust',
        september: 'Sentyabr',
        october: 'Oktyabr',
        november: 'Noyabr',
        december: 'Dekabr',
        format: 'yyyy-MM',
        daysAbbreviation: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
    },
    DateRangePicker: {
        ...Calendar,
        last7Days: 'Oxirgi 7 kun'
    },
    Picker: {
        noResultsText: 'Ma\'lumot topilmadi',
        placeholder: 'Tanlash',
        searchPlaceholder: 'Qidirish',
        checkAll: 'Barchasi'
    },
    InputPicker: {
        newItem: 'Yangi item',
        createOption: 'Qiymat yaratish "{0}"'
    },
    Uploader: {
        inited: 'Initial',
        progress: 'Uploading',
        error: 'Error',
        complete: 'Finished',
        emptyFile: 'Empty',
        upload: 'Upload'
    },
    CloseButton: {
        closeLabel: 'Yopish'
    },
    Breadcrumb: {
        expandText: 'Show path'
    },
    Toggle: {
        on: 'Ochish',
        off: 'Yopish'
    }
};


export default locale